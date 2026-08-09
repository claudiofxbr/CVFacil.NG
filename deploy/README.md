# Deploy CVFacil.NG na VPS Hostinger

Domínio de produção: **cvfacil.xavierbr-vps.tech**. Repositório: **https://github.com/claudiofxbr/CVFacil.NG**. Falta preencher apenas `<CAMINHO_NA_VPS>` (em `scripts/deploy-vps.sh` e nos `.service`) antes de rodar de verdade.

## Pré-requisitos na VPS
- Docker + Docker Compose (para o backend)
- Node.js 18+ (para `next start` do frontend)
- Nginx
- Certbot (HTTPS via Let's Encrypt)

## Passos
1. Copiar o projeto para `<CAMINHO_NA_VPS>/CVFacil.NG` (git clone ou rsync) — ver `scripts/deploy-vps.sh`.
2. Criar `.env` na raiz de `CVFacil.NG/` com os valores reais de produção (nunca commitar este arquivo).
3. Definir `ALLOWED_ORIGINS=https://cvfacil.xavierbr-vps.tech` no `.env`.
4. Backend: `docker compose -f config/docker-compose.yml up -d --build` (ou usar `cvfacil-backend.service`).
5. Frontend: `cd frontend && NEXT_PUBLIC_API_URL=https://cvfacil.xavierbr-vps.tech/api npm run build` e então usar `cvfacil-frontend.service`.
6. Copiar `nginx-cvfacil.conf` para `/etc/nginx/sites-available/cvfacil`, symlink em `sites-enabled/`, `nginx -t` e `systemctl reload nginx`.
7. `sudo certbot --nginx -d cvfacil.xavierbr-vps.tech` para HTTPS.

O script `scripts/deploy-vps.sh` já automatiza os passos 1 e 3–6 (com o domínio acima embutido).

## Pendências que exigem confirmação
- Caminho de deploy na VPS (`<CAMINHO_NA_VPS>`).
- Se o backend deve rodar via Docker (como configurado aqui) ou diretamente via `java -jar` + systemd — ambos funcionam, Docker foi escolhido por já existir a infra parcial no repo.
