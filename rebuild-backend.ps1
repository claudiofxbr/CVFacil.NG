# Rebuild Backend Script for CVFacil.NG
# This script ensures a clean build by termination blocking processes and cleaning the target directory.

Write-Host "--- Iniciando reconstrução robusta do Backend ---" -ForegroundColor Cyan

# 1. Tentar derrubar processos Java que possam estar travando o JAR
Write-Host "[1/4] Procurando processos Java bloqueadores..." -ForegroundColor Yellow
# Força o encerramento de qualquer java.exe que possa estar segurando o arquivo
taskkill /F /IM java.exe /T 2>$null
Start-Sleep -Seconds 2

# 2. Limpar a pasta target manualmente se o Maven falhar
Write-Host "[2/4] Limpando diretório 'target'..." -ForegroundColor Yellow
if (Test-Path "backend/target") {
    $retryCount = 0
    while ($retryCount -lt 3) {
        try {
            Remove-Item -Recurse -Force "backend/target" -ErrorAction Stop
            Write-Host "Diretório 'target' removido com sucesso."
            break
        } catch {
            $retryCount++
            Write-Host "Falha ao remover 'target' (Tentativa $retryCount/3). Aguardando lock..." -ForegroundColor Gray
            Start-Sleep -Seconds 3
        }
    }
}

# 3. Executar o Maven Wrapper para rebuild completo
Write-Host "[3/4] Executando Maven clean package..." -ForegroundColor Yellow
cd backend
./mvnw.cmd clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "[4/4] SUCESSO: Backend reconstruído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "[4/4] ERRO: Falha na compilação do Maven." -ForegroundColor Red
    exit $LASTEXITCODE
}

cd ..
Write-Host "--- Processo concluído ---" -ForegroundColor Cyan
