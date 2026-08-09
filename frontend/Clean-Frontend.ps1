# Clean-Frontend.ps1 - V1.0
# Script para limpeza segura do Frontend CVFacil.NG

$ErrorActionPreference = "SilentlyContinue"

Write-Host "--- [SRE] LIMPANDO AMBIENTE FRONTEND ---" -ForegroundColor Yellow

# 1. Parar processos Node/Next
Write-Host "[1/3] Encerrando processos Node/Next..." -NoNewline
Get-Process node | Stop-Process -Force
Write-Host " [OK]" -ForegroundColor Green

# 2. Remover Caches
Write-Host "[2/3] Removendo caches (.next, out)..." -NoNewline
Remove-Item -Path ".next", "out" -Recurse -Force
Write-Host " [OK]" -ForegroundColor Green

# 3. Validar Dependências (Opcional)
Write-Host "[3/3] Ambiente pronto para nova compilação." -ForegroundColor Cyan

Write-Host "`nLimpeza concluída com sucesso." -ForegroundColor Green
