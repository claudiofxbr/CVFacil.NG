-- A entidade Education.java sempre teve o campo "description", mas nenhuma migration
-- anterior criou a coluna em cv_educations (V1 criou em cv_experiences, mas nao aqui).
-- Isso so ficou visivel ao rodar as migrations do zero num banco novo; no banco de
-- producao original isso provavelmente foi corrigido manualmente fora do Flyway.
ALTER TABLE "cv_educations" ADD COLUMN IF NOT EXISTS "description" TEXT;
