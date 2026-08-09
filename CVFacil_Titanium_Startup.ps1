# CVFacil_Titanium_Startup.ps1 - Orquestrador de Inicialização Limpa
# Objetivo: Sanitização total e inicialização sequencial do ecossistema CVFacil.NG

$ErrorActionPreference = "Stop"
$StartTime = Get-Date

function Write-Step ($msg, $color = "Cyan") {
    Write-Host "`n[$(Get-Date -Format "HH:mm:ss")] >>> $msg" -ForegroundColor $color
}

# --- 0. CARREGAMENTO DE CONFIGURAÇÕES (.env) ---
Write-Step "Fase 0: Carregando configurações do arquivo .env..." "Gray"
if (Test-Path ".env") {
    foreach ($line in Get-Content ".env") {
        if ($line -match '^([^=#]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Set: $name" -ForegroundColor DarkGray
        }
    }
    Write-Host ".env carregado com sucesso." -ForegroundColor Green
} else {
    Write-Host "AVISO: Arquivo .env não encontrado!" -ForegroundColor Yellow
}

# --- 1. OPERAÇÕES DE LIMPEZA (SANITIZAÇÃO) ---
Write-Step "Fase 1: Realizando limpeza de estados e arquivos residuais..." "Yellow"

$processes = @("java", "node", "npm")
foreach ($proc in $processes) {
    Get-Process $proc -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Processos '$proc' encerrados." -ForegroundColor Gray
}

$pathsToClean = @("backend/target", "frontend/.next", "frontend/out", "backend/startup.log", "frontend/startup.log")
foreach ($path in $pathsToClean) {
    if (Test-Path $path) {
        Remove-Item -Path $path -Recurse -Force
        Write-Host "Removido: $path" -ForegroundColor Gray
    }
}
Write-Host "Ambiente sanitizado com sucesso." -ForegroundColor Green

# --- 2. INICIALIZAÇÃO DO BACKEND ---
Write-Step "Fase 2: Inicializando o Backend (Spring Boot + Neon DB)..." "Cyan"

if (Test-Path "backend") {
    Push-Location "backend"
    
    $jarPath = "target/cvfacil-backend-boot.jar"
    if (Test-Path $jarPath) {
        Write-Host "Limpando JAR anterior..." -ForegroundColor DarkGray
        Remove-Item $jarPath -Force -ErrorAction SilentlyContinue
    }

    Write-Host "Compilando binário fresh..." -ForegroundColor Yellow
    .\mvnw.cmd clean package -DskipTests
    
    Write-Host "Disparando servidor (Logs em backend/startup.log)..." -ForegroundColor Gray
    
    # Mapeando variáveis do .env para argumentos do Java (Forçado)
    $envArgs = ""
    if ($env:ROOT_EMAIL) { $envArgs += " -Dapp.root.email=$env:ROOT_EMAIL" }
    if ($env:ROOT_PASSWORD) { $envArgs += " -Dapp.root.password=$env:ROOT_PASSWORD" }
    if ($env:JWT_SECRET) { $envArgs += " -Djwt.secret=$env:JWT_SECRET" }
    if ($env:DB_URL) { $envArgs += " -Dspring.datasource.url=$env:DB_URL" }
    if ($env:DB_USERNAME) { $envArgs += " -Dspring.datasource.username=$env:DB_USERNAME" }
    if ($env:DB_PASSWORD) { $envArgs += " -Dspring.datasource.password=$env:DB_PASSWORD" }
    
    $javaArgs = "-Dspring.profiles.active=neon -Dserver.port=7777 $envArgs -jar target/cvfacil-backend-boot.jar"
    
    Start-Process -FilePath "java" -ArgumentList $javaArgs -RedirectStandardOutput "startup.log" -RedirectStandardError "startup_err.log" -WindowStyle Hidden
    Pop-Location
    
    # Validação de disponibilidade (Health Check)
    Write-Host "Aguardando Backend responder (Porta 7777)..." -ForegroundColor Gray
    $retries = 0
    $ready = $false
    while ($retries -lt 12 -and -not $ready) {
        try {
            $status = Invoke-RestMethod -Uri "http://localhost:7777/api/public/status" -Method Get -ErrorAction SilentlyContinue
            if ($status.status -eq "UP") { 
                $ready = $true
                Write-Host "Backend ONLINE!" -ForegroundColor Green
            }
        } catch {}
        if (-not $ready) {
            Start-Sleep -Seconds 10
            $retries++
            Write-Host "Aguardando... ($($retries * 10)s)" -ForegroundColor Gray
        }
    }
}

# --- 3. INICIALIZAÇÃO DO FRONTEND ---
Write-Step "Fase 3: Inicializando o Frontend (Next.js)..." "Cyan"

if (Test-Path "frontend") {
    Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
    
    # Aguarda o Next.js subir a porta
    Start-Sleep -Seconds 10
    Write-Host "Frontend disparado." -ForegroundColor Green
}

# --- 4. INICIALIZAÇÃO DO APLICATIVO CVFacil.NG ---
Write-Step "Fase 4: Lançando CVFacil.NG..." "Green"

$Url = "http://localhost:3000"
Write-Host "Abrindo aplicativo em: $Url" -ForegroundColor Gray
Start-Process $Url

$Duration = (Get-Date) - $StartTime
Write-Host "`nInicialização concluída em $($Duration.Seconds)s! Sistema pronto para uso." -ForegroundColor Green
