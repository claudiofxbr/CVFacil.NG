#!/usr/bin/env bash
# Roda NA VPS Hostinger (via SSH). Atualiza codigo, builda backend (Docker) e
# frontend (Next.js), reinicia os servicos systemd e recarrega o nginx.
set -euo pipefail

# ===== CONFIGURACAO - preencher antes de usar =====
REPO_URL="https://github.com/claudiofxbr/CVFacil.NG.git"
DEPLOY_PATH="<CAMINHO_NA_VPS>/CVFacil.NG"
DOMAIN="cvfacil.xavierbr-vps.tech"
BRANCH="main"
# ====================================================

if [[ "$DEPLOY_PATH" == *"<CAMINHO_NA_VPS>"* ]]; then
    echo "ERRO: preencha DEPLOY_PATH no topo deste script antes de rodar." >&2
    exit 1
fi

echo ">>> Atualizando codigo..."
if [ -d "$DEPLOY_PATH/.git" ]; then
    cd "$DEPLOY_PATH"
    git fetch origin
    git reset --hard "origin/$BRANCH"
else
    git clone --branch "$BRANCH" "$REPO_URL" "$DEPLOY_PATH"
    cd "$DEPLOY_PATH"
fi

echo ">>> Verificando .env de producao..."
if [ ! -f ".env" ]; then
    echo "ERRO: .env nao encontrado em $DEPLOY_PATH. Ele NUNCA vem do git (esta no .gitignore)." >&2
    echo "Crie manualmente com as credenciais reais de producao (Neon, JWT_SECRET, etc) antes de continuar." >&2
    exit 1
fi

echo ">>> Setando ALLOWED_ORIGINS para o dominio de producao (se ainda nao estiver)..."
if ! grep -q "^ALLOWED_ORIGINS=" .env; then
    echo "ALLOWED_ORIGINS=https://$DOMAIN" >> .env
fi

echo ">>> Build e subida do backend (Docker Compose)..."
docker compose -f config/docker-compose.yml up -d --build

echo ">>> Build do frontend (Next.js)..."
cd frontend
export NEXT_PUBLIC_API_URL="https://$DOMAIN/api"
npm ci
npm run build
cd ..

echo ">>> Reiniciando servico do frontend (systemd)..."
sudo systemctl restart cvfacil-frontend

echo ">>> Recarregando nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo ">>> Deploy concluido. Acesse: https://$DOMAIN"
