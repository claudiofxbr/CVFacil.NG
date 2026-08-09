# Build-Omniscience.ps1 - CVFacil.NG V14.0
# Painel de Controle Interativo: Limpeza e Compilação

$ErrorActionPreference = "Stop"

function Show-Header {
    Clear-Host
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   CVFacil.NG - PAINEL OMNISCIENCE V14.0" -ForegroundColor Cyan
    Write-Host "================================================`n" -ForegroundColor Cyan
}

function Invoke-Cleanup {
    Write-Host ">>> Iniciando Faxina Geral..." -ForegroundColor Yellow
    # 1. Processos
    $processes = @("java", "node", "mvn")
    foreach ($proc in $processes) {
        Get-Process $proc -ErrorAction SilentlyContinue | Stop-Process -Force
    }
    # 2. Caches
    $pathsToClean = @("backend/target", "frontend/.next", "frontend/out")
    foreach ($path in $pathsToClean) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force
        }
    }
    Write-Host "OK: Sistema limpo e processos encerrados.`n" -ForegroundColor Green
}

function Invoke-DeepCleanup {
    Write-Host ">>> INICIANDO FAXINA DEEP (REINSTALACAO)..." -ForegroundColor Magenta
    Invoke-Cleanup
    $nodeModules = "frontend/node_modules"
    if (Test-Path $nodeModules) {
        Write-Host "Removendo node_modules (isso pode demorar...)" -ForegroundColor Gray
        Remove-Item -Path $nodeModules -Recurse -Force
    }
    Push-Location "frontend"
    Write-Host "Reinstalando dependencias..." -ForegroundColor Gray
    npm install
    Pop-Location
    Write-Host "OK: Sistema restaurado do zero.`n" -ForegroundColor Green
}

function Build-Backend {
    Write-Host ">>> Compilando BACKEND (Spring Boot)..." -ForegroundColor Yellow
    Push-Location "backend"
    try {
        .\mvnw.cmd clean package -DskipTests
        Write-Host "OK: Backend compilado com sucesso.`n" -ForegroundColor Green
    } catch {
        Write-Host "`n[ERRO] Falha no build do Backend!" -ForegroundColor Red
        Pop-Location
        return $false
    }
    Pop-Location
    return $true
}

function Build-Frontend {
    Write-Host ">>> Compilando FRONTEND (Next.js)..." -ForegroundColor Yellow
    Push-Location "frontend"
    try {
        cmd /c npm run build
        Write-Host "OK: Frontend compilado com sucesso.`n" -ForegroundColor Green
    } catch {
        Write-Host "`n[ERRO] Falha no build do Frontend!" -ForegroundColor Red
        Pop-Location
        return $false
    }
    Pop-Location
    return $true
}

function Launch-Browser {
    $url = "http://localhost:3000"
    Write-Host ">>> Abrindo aplicativo no navegador padrao: $url" -ForegroundColor Yellow
    Start-Process $url
}

function Start-AppServers {
    Write-Host ">>> Iniciando Motores (Backend + Frontend)..." -ForegroundColor Yellow
    
    # Iniciar Backend em nova janela
    Write-Host "Iniciando Servidor Backend (Porta 7777)..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- BACKEND LOGS ---' -ForegroundColor Cyan; cd backend; java -jar target/cvfacil-ng-backend-1.0.0.jar"
    
    # Iniciar Frontend em nova janela
    Write-Host "Iniciando Servidor Frontend (Porta 3000)..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- FRONTEND LOGS ---' -ForegroundColor Magenta; cd frontend; npm run dev"
    
    Write-Host "`nAguardando inicializacao (10s)..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    
    Launch-Browser
}

do {
    Show-Header
    Write-Host "1. Faxina Geral (Processos + Caches)" -ForegroundColor White
    Write-Host "2. FAXINA DEEP (Limpeza de node_modules + Reinstalacao)" -ForegroundColor Magenta
    Write-Host "3. Compilar apenas Backend (Maven)" -ForegroundColor White
    Write-Host "4. Compilar apenas Frontend (Next.js)" -ForegroundColor White
    Write-Host "5. Build Total (Limpeza + Backend + Frontend)" -ForegroundColor Cyan
    Write-Host "6. Abrir Aplicativo no Navegador (Link Direto)" -ForegroundColor White
    Write-Host "7. LIGAR MOTORES (Executar Backend + Frontend)" -ForegroundColor Green
    Write-Host "8. Sair" -ForegroundColor Red
    Write-Host "`nEscolha uma opcao: " -NoNewline
    $choice = Read-Host

    switch ($choice) {
        "1" { Invoke-Cleanup }
        "2" { Invoke-DeepCleanup }
        "3" { Build-Backend }
        "4" { Build-Frontend }
        "5" { 
            Invoke-Cleanup
            if (Build-Backend) { 
                if (Build-Frontend) {
                    Write-Host "`nBuild Total concluido! Deseja Abrir Motores agora? (S/N): " -NoNewline
                    $autoRun = Read-Host
                    if ($autoRun -eq "S" -or $autoRun -eq "s") { Start-AppServers }
                }
            }
        }
        "6" { Launch-Browser }
        "7" { Start-AppServers }
        "8" { Write-Host "Saindo...`n" -ForegroundColor Gray; break }
        default { Write-Host "Opcao invalida!`n" -ForegroundColor Red }
    }

    if ($choice -ne "8") {
        Write-Host "Pressione qualquer tecla para voltar ao menu..."
        $null = [Console]::ReadKey()
    }
} while ($choice -ne "7")
