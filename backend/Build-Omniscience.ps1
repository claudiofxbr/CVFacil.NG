# Build-Omniscience.ps1 - CVFacil.NG V12.0 (SRE Edition)
$LOG_FILE = "backend_startup.log"
$TARGET_JAR = "target/cvfacil-ng-backend-1.0.0.jar"

function Write-Log {
    param([string]$message, [string]$color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $formattedMessage = "[$timestamp] $message"
    Write-Host $formattedMessage -ForegroundColor $color
    $formattedMessage | Out-File -FilePath $LOG_FILE -Append
}

Write-Log "========================================" "Cyan"
Write-Log "INICIANDO OMNISCIENCE BUILD v12.0" "Cyan"
Write-Log "Foco: Estabilidade e Confiabilidade SRE" "Cyan"
Write-Log "========================================" "Cyan"

# 1. Limpeza de Ambiente
Write-Log "Limpando processos Java/Maven órfãos..." "Yellow"
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process mvn -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Varredura de Conectividade NeonDB
Write-Log "Testando conectividade com NeonDB (PostgreSQL)..." "Yellow"
$testConnection = Test-NetConnection -ComputerName "ep-crimson-cloud-a40pwy57.us-east-1.aws.neon.tech" -Port 5432 -ErrorAction SilentlyContinue
if ($testConnection.TcpTestSucceeded) {
    Write-Log "CHECK: Conexão com Banco de Dados OK." "Green"
} else {
    Write-Log "ALERTA: Não foi possível alcançar o NeonDB na porta 5432." "Red"
    Write-Log "Verifique suas credenciais no application-neon.properties." "Red"
}

# 3. Build Atômico
Write-Log "Iniciando compilação Maven (Limpando e Empacotando)..." "Yellow"
.\mvnw.cmd clean package -DskipTests | Tee-Object -FilePath $LOG_FILE -Append

if ($LASTEXITCODE -ne 0) {
    Write-Log "FALHA CRÍTICA NA COMPILAÇÃO. Verifique o log acima." "Red"
    exit 1
}

# 4. Verificação de Integridade
if (Test-Path $TARGET_JAR) {
    Write-Log "CHECK: Artefato JAR gerado com sucesso." "Green"
} else {
    Write-Log "ERRO: JAR não encontrado após o build." "Red"
    exit 1
}

# 5. Execução em Segundo Plano com Monitoramento
Write-Log "Subindo servidor CVFacil na porta 7777..." "Green"
Write-Log "Monitorando: backend_stdout.log e backend_stderr.log" "Cyan"

# Usando Start-Process com logs separados para evitar erro de concorrência
Start-Process java -ArgumentList "-jar $TARGET_JAR" -RedirectStandardOutput "backend_stdout.log" -RedirectStandardError "backend_stderr.log" -WindowStyle Hidden

Write-Log "SOLUÇÃO OMNISCIENCE ATIVA." "Green"
Write-Log "Acesse http://localhost:7777/api/public/status para validar." "Cyan"
