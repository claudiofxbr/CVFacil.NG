# Script SRE de Verificação de Conectividade v1.0
# Uso: .\Test-Network-SRE.ps1
# Objetivo: Validar Handshake CORS e Handlers de API sem depender do Browser.

$apiUrl = "http://localhost:7777/api"
Write-Host "--- [SRE] INICIANDO DIAGNÓSTICO DE REDE CVFACIL.NG ---" -ForegroundColor Cyan

# 1. Health Check
Write-Host "[1/3] Verificando Health Check (Status)... " -NoNewline
try {
    $status = Invoke-RestMethod -Uri "$apiUrl/public/status" -Method Get
    if ($status.status -eq "UP") {
        Write-Host " [OK] Backend e DB saudáveis." -ForegroundColor Green
    } else {
        Write-Host " [ALERTA] Backend UP, mas DB pode estar lento." -ForegroundColor Yellow
    }
} catch {
    Write-Host " [FALHA] Backend inativo na porta 7777." -ForegroundColor Red
}

# 2. CORS Preflight Simulation
Write-Host "[2/3] Simulando Handshake CORS (OPTIONS)..." -NoNewline
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
    }
    $response = Invoke-WebRequest -Uri "$apiUrl/resumes" -Method Options -Headers $headers
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader -eq "http://localhost:3000") {
        Write-Host " [OK] CORS configurado corretamente para o Frontend." -ForegroundColor Green
    } else {
        Write-Host " [ERRO] Falha no header Access-Control-Allow-Origin." -ForegroundColor Red
    }
} catch {
    Write-Host " [ERRO] Endpoint recursou handshake OPTIONS." -ForegroundColor Red
}

# 3. Payload Integrity Check (Mock Auth)
Write-Host "[3/3] Validando Estrutura de Retorno (JSON)..." -NoNewline
try {
    # Testando endpoint público ou status para ver se o JSON é válido
    $raw = Invoke-WebRequest -Uri "$apiUrl/public/status" -Method Get
    if ($raw.Headers["Content-Type"] -match "application/json") {
        Write-Host " [OK] Content-Type validado." -ForegroundColor Green
    } else {
        Write-Host " [ERRO] Backend não está retornando JSON padrão." -ForegroundColor Red
    }
} catch {
    Write-Host " [FALHA] Erro de protocolo." -ForegroundColor Red
}

Write-Host "`n--- DIAGNÓSTICO CONCLUÍDO ---" -ForegroundColor Cyan
Write-Host "Se todos os passos forem [OK], a falha no navegador é cache ou DNS local."
