# Titanium_Orchestrator.ps1 - Orquestrador SRE CVFacil.NG
# Verso: 1.0 (Titanium Grade)
# Linguagem: PowerShell 5.1+
# Objetivo: Garantir inicializao limpa, estvel e testada do ecossistema CVFacil.NG.

$ErrorActionPreference = "Stop"
$StartTime = Get-Date

# Configuraes de Portas e URLs
$BackendPort = 7777
$FrontendPort = 3000
$BackendHealthUrl = "http://localhost:$($BackendPort)/api/public/status"
$FrontendUrl = "http://localhost:$($FrontendPort)"
$TimeoutSeconds = 120
$BackendLog = "backend/startup.log"
$FrontendLog = "frontend/startup.log"

function Write-Log ($message, $color = "White") {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $message" -ForegroundColor $color
}

Write-Log "Fase 0: Carregando Configuraes (.env)..." "Cyan"
if (Test-Path ".env") {
    foreach ($line in Get-Content ".env") {
        if ($line -match '^([^=#]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Log "Configuraes carregadas com sucesso." "Gray"
} else {
    Write-Log "AVISO: Arquivo .env no encontrado. Usando defaults do Spring." "Yellow"
}

# --- FASE 1: LIMPEZA PR-INICIALIZAO ---
Write-Log "Fase 1: Iniciando Limpeza Geral (Sanitizao)..." "Cyan"

function Stop-ProcessByPort($port) {
    if ($port -eq $null) { return }
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Log "Encerrando processo na porta $port..." "Yellow"
        foreach ($c in $conn) {
            Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

Stop-ProcessByPort $BackendPort
Stop-ProcessByPort $FrontendPort

# Limpeza de Artefatos e Logs Antigos
$pathsToClean = @("backend/target", "frontend/.next", "frontend/out", $BackendLog, $FrontendLog)
foreach ($path in $pathsToClean) {
    if (Test-Path $path) {
        Write-Log "Removendo: $path" "Gray"
        Remove-Item -Path $path -Recurse -Force
    }
}
Write-Log "Fase 1 Concluda: Ambiente sanitizado." "Green"

# --- FASE 2: INICIALIZAO ATMICA ---
Write-Log "Fase 2: Iniciando Motores (Build & Launch)..." "Cyan"

try {
    Write-Log "Back-end: Compilando (Auditoria Completa)..." "Gray"
    Push-Location "backend"
    # Removido -q para garantir visibilidade total de erros de dependncia/compilao
    .\mvnw.cmd clean package -DskipTests 
    Pop-Location
    
    Write-Log "Back-end: Disparando servidor (Log -> $BackendLog)..." "Yellow"
    $beProcess = Start-Process powershell -ArgumentList "-Command", "cd backend; java -jar target/cvfacil-backend-boot.jar > ../$BackendLog 2>&1" -PassThru
    
    # Checkpoint de 5 segundos para detectar morte prematura da JVM (Crashes de Placeholder/DB)
    Start-Sleep -Seconds 5
    if ($beProcess.HasExited) {
        Write-Log "FALHA CRTICA: O Back-end encerrou prematuramente!" "Red"
        Write-Log "--- DIAGNSTICO DE ERRO (stderr) ---" "Yellow"
        if (Test-Path $BackendLog) { Get-Content $BackendLog -Tail 20 | Select-String "Error", "Exception", "Could not" }
        exit 1
    }

    Write-Log "Front-end: Disparando Next.js (Log -> $FrontendLog)..." "Yellow"
    Start-Process powershell -ArgumentList "-Command", "cd frontend; npm run dev > ../$FrontendLog 2>&1"
} catch {
    Write-Log "FALHA CRTICA na Fase 2: $($_.Exception.Message)" "Red"
    exit 1
}

# --- FASE 3: VERIFICAO PS-INICIALIZAO (HEALTH CHECK) ---
Write-Log "Fase 3: Validando Operabilidade (Health Check)..." "Cyan"
$ready = $false
$elapsed = 0

while (-not $ready -and $elapsed -lt $TimeoutSeconds) {
    try {
        $beCheck = Invoke-RestMethod -Uri $BackendHealthUrl -Method Get -ErrorAction SilentlyContinue
        $feCheck = Invoke-WebRequest -Uri $FrontendUrl -Method Get -ErrorAction SilentlyContinue
        
        # Verifica se o status do backend "UP" conforme definido no StatusController
        if ($beCheck -and $beCheck.status -eq "UP" -and $feCheck.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        # Aguarda os servios subirem
    }
    
    if (-not $ready) {
        # Check if the process is dead
        if ($null -ne $javaProc -and $null -eq (Get-Process -Id $javaProc.Id -ErrorAction SilentlyContinue)) {
            Write-Log "Processo JAVA encerrou inesperadamente!" "Red"
            if (Test-Path $BackendLog) { Get-Content $BackendLog -Tail 20 | Write-Log -Color Yellow }
            exit 1
        }

        # Check for fatal errors in the log even if process is still "alive" (terminating)
        if (Test-Path $BackendLog) {
            $fatal = Get-Content $BackendLog -Tail 50 | Select-String "BeanCreationException", "SchemaManagementException", "PropertyReferenceException", "fatal"
            if ($fatal) {
                Write-Log "FALHA CRTICA DETECTADA NOS LOGS (Auto-Diagnstico)!" "Red"
                Get-Content $BackendLog -Tail 20 | Write-Log -Color Yellow
                exit 1
            }
        }

        Write-Log "Aguardando servios... ($elapsed s)" "Gray"
        Start-Sleep -Seconds 10
        $elapsed += 10
    }
}

if (-not $ready) {
    Write-Log "ERRO: Servios no responderam dentro de $TimeoutSeconds segundos." "Red"
    Write-Log "--- LTIMAS LINHAS DO LOG BACK-END ---" "Yellow"
    if (Test-Path $BackendLog) { Get-Content $BackendLog -Tail 15 }
    
    Write-Log "--- LTIMAS LINHAS DO LOG FRONT-END ---" "Yellow"
    if (Test-Path $FrontendLog) { Get-Content $FrontendLog -Tail 15 }

    Write-Log "Executando Rollback..." "Red"
    Stop-ProcessByPort $BackendPort
    Stop-ProcessByPort $FrontendPort
    exit 1
}

# --- FASE 4: LIBERAO PARA USO ---
Write-Log "Fase 4: Sistema Validado e Liberado!" "Green"
$TotalTime = (Get-Date) - $StartTime
Write-Log "Tempo total de arranque: $($TotalTime.Seconds)s" "Cyan"

Write-Log "Abrindo Dashboard..." "Green"
Start-Process $FrontendUrl

# Exit Code 0 para integrao CI/CD (Sucesso)
exit 0
