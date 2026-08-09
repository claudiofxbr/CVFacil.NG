-- Adiciona coluna de Role para controle de acesso RBAC
ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER' NOT NULL;
