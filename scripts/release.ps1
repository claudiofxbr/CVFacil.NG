<#
.SYNOPSIS
    Pipeline completo de release do CVFacil.NG: GitHub -> deploy na VPS Hostinger.
.DESCRIPTION
    1. Envia o codigo para o GitHub (publish-github.ps1)
    2. Conecta via SSH na VPS e roda deploy-vps.sh la
.PARAMETER VpsHost
    Usuario e host da VPS no formato usuario@ip-ou-dominio (ex: root@123.45.67.89)
.PARAMETER RemoteUrl
    URL do repositorio GitHub
.PARAMETER RemoteScriptPath
    Caminho do deploy-vps.sh dentro da VPS (apos o primeiro deploy manual/clone)
.EXAMPLE
    .\release.ps1 -VpsHost "root@123.45.67.89" -RemoteUrl "https://github.com/claudiofxbr/CVFacil.NG.git"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$VpsHost,

    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl,

    [string]$RemoteScriptPath = "~/CVFacil.NG/scripts/deploy-vps.sh"
)

$ErrorActionPreference = "Stop"

Write-Host "===== ETAPA 1/2: Publicando no GitHub =====" -ForegroundColor Cyan
& "$PSScriptRoot\publish-github.ps1" -RemoteUrl $RemoteUrl

Write-Host "===== ETAPA 2/2: Deploy na VPS Hostinger =====" -ForegroundColor Cyan
ssh $VpsHost "bash $RemoteScriptPath"

Write-Host ">>> Release concluido." -ForegroundColor Green
