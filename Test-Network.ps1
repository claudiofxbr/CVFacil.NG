# Test-Network.ps1 - Diagnóstico Unificado CVFacil.NG (SRE)
# Uso: .\Test-Network.ps1

$ErrorActionPreference = "SilentlyContinue"
$backendUrl = "http://localhost:7777/api"
$frontendUrl = "http://localhost:3000"

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   CVFacil.NG - DIAGNÓSTICO DE REDE E CONEXÃO" -ForegroundColor Cyan
Write-Host "====================================================`n" -ForegroundColor Cyan

# 1. Teste de Backend
Write-Host "[1/4] Testando Backend (Porta 7777)..." -NoNewline
try {
    $resp = Invoke-RestMethod -Uri "$backendUrl/public/status" -Method Get -TimeoutSec 3
    if ($resp.status -eq "UP") {
        Write-Host " [OK] Backend ONLINE e DB conectado." -ForegroundColor Green
    } else {
        Write-Host " [AVISO] Backend ONLINE, mas Status DB: $($resp.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [OFFLINE] Backend não responde em $backendUrl" -ForegroundColor Red
}

# 2. Teste de Frontend
Write-Host "[2/4] Testando Frontend (Porta 3000)..." -NoNewline
try {
    $resp = Invoke-WebRequest -Uri $frontendUrl -Method Get -TimeoutSec 3
    if ($resp.StatusCode -eq 200) {
        Write-Host " [OK] Frontend ONLINE." -ForegroundColor Green
    } else {
        Write-Host " [ERRO] Frontend retornou Status $($resp.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host " [OFFLINE] Frontend não responde em $frontendUrl" -ForegroundColor Red
}

# 3. Teste de Handshake CORS (SRE Simulação)
Write-Host "[3/4] Validando Permissões CORS..." -NoNewline
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "GET"
    }
    $resp = Invoke-WebRequest -Uri "$backendUrl/resumes" -Method Options -Headers $headers -TimeoutSec 3
    $allowed = $resp.Headers["Access-Control-Allow-Origin"]
    if ($allowed -match "3000" -or $allowed -eq "*") {
        Write-Host " [OK] CORS configurado corretamente." -ForegroundColor Green
    } else {
        Write-Host " [AVISO] Header CORS inesperado: $allowed" -ForegroundColor Yellow
    }
} catch {
    Write-Host " [FALHA] Handshake CORS negado ou falha no Preflight." -ForegroundColor Red
}

# 4. Verificação de Configuração
Write-Host "[4/4] Verificando Configuração de API no Frontend..." -NoNewline
$configFile = "frontend/src/config.js"
if (Test-Path $configFile) {
    if ((Get-Content $configFile) -match "7777") {
        Write-Host " [OK] URL da API aponta para Porta 7777." -ForegroundColor Green
    } else {
        Write-Host " [ERRO] URL da API em config.js parece incorreta." -ForegroundColor Red
    }
} else {
    Write-Host " [FALHA] Arquivo config.js não encontrado." -ForegroundColor Red
}

Write-Host "`n--- RESUMO DO DIAGNÓSTICO ---" -ForegroundColor Cyan
Write-Host "Se houver falhas [OFFLINE], verifique se os motores foram ligados com 'Build-Omniscience.ps1'." -ForegroundColor Gray
Write-Host "Pressione qualquer tecla para sair..."
$null = [Console]::ReadKey()
