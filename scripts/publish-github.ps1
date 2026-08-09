<#
.SYNOPSIS
    Envia o codigo do CVFacil.NG para o GitHub.
.DESCRIPTION
    Roda LOCALMENTE (Windows). Inicializa o repo git se necessario, valida que nenhum
    arquivo sensivel (.env, uploads) esta staged, e faz push para o remoto.
.PARAMETER RemoteUrl
    URL do repositorio GitHub (ex: https://github.com/claudiofxbr/CVFacil.NG.git)
.PARAMETER Branch
    Branch de destino (default: main)
.EXAMPLE
    .\publish-github.ps1 -RemoteUrl "https://github.com/claudiofxbr/CVFacil.NG.git"
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl,

    [string]$Branch = "main",

    [string]$CommitMessage = "Deploy: atualizacao do CVFacil.NG"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host ">>> Diretorio do repo: $repoRoot"

if (-not (Test-Path ".git")) {
    Write-Host ">>> Nenhum repositorio git encontrado. Inicializando..."
    git init
    git branch -M $Branch
} else {
    Write-Host ">>> Repositorio git ja existe."
}

if (-not (Test-Path ".gitignore")) {
    Write-Error "ABORTADO: .gitignore nao encontrado. Nao prosseguir sem ele (risco de commitar .env/uploads)."
}

$existingRemote = git remote 2>$null | Select-String "^origin$"
if (-not $existingRemote) {
    Write-Host ">>> Adicionando remoto origin: $RemoteUrl"
    git remote add origin $RemoteUrl
} else {
    $currentUrl = git remote get-url origin
    if ($currentUrl -ne $RemoteUrl) {
        Write-Warning "Remoto 'origin' ja aponta para '$currentUrl', diferente do informado ('$RemoteUrl'). Mantendo o existente."
    }
}

git add .

# Seguranca: aborta se algo sensivel ficou staged (gitignore mal aplicado, arquivo novo, etc)
$staged = git status --porcelain
$forbiddenPatterns = @('\.env$', '\.env\.local$', '^backend/uploads/', '^uploads/')
foreach ($pattern in $forbiddenPatterns) {
    if ($staged -match $pattern) {
        git reset
        Write-Error "ABORTADO: arquivo sensivel detectado no staging (padrao: $pattern). Revise o .gitignore antes de tentar de novo."
    }
}

$pending = git status --porcelain
if (-not $pending) {
    Write-Host ">>> Nada para commitar (working tree limpo)."
} else {
    git commit -m $CommitMessage
}

Write-Host ">>> Enviando para $RemoteUrl ($Branch)..."
git push -u origin $Branch

Write-Host ">>> Push concluido."
