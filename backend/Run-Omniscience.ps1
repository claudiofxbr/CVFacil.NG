# Run-Omniscience.ps1 - CVFacil.NG V11.0
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "INICIANDO OMNISCIENCE v11.0" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# 1. Matar processos zumbis
Write-Host "Limpando processos Java antigos..." -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process mvn -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Build Limpo
Write-Host "Construindo executável (JAR)..." -ForegroundColor Yellow
.\mvnw.cmd clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "FALHA NA COMPILACAO. Verifique o código acima." -ForegroundColor Red
    exit 1
}

# 3. Carregar Variáveis de Ambiente (.env)
$envPath = "..\.env"
if (Test-Path $envPath) {
    Write-Host "Carregando configurações de $envPath..." -ForegroundColor Cyan
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^(?<key>[^#\s=]+)=(?<value>.*)$") {
            $key = $Matches["key"]
            $value = $Matches["value"].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            Write-Host " [Set] $key" -ForegroundColor Gray
        }
    }
}

# 4. Execução Direta
Write-Host "Subindo servidor (Execução Direta do JAR na porta 7777)..." -ForegroundColor Green
java "-Dserver.port=7777" -jar target/cvfacil-backend-boot.jar
