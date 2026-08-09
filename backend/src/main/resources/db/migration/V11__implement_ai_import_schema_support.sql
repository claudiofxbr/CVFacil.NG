-- Migration V11: Suporte completo para Importação IA e Estilização de Currículos
-- Garante que todos os campos extraídos pela IA e usados no builder Premium existam.

-- 1. Campos de Estilização em cv_resumes
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "template_style" VARCHAR(100) DEFAULT 'Corporativo';
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "font_family" VARCHAR(100) DEFAULT 'Inter';
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "font_size" INTEGER DEFAULT 12;
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "line_height" NUMERIC DEFAULT 1.5;

-- 2. Garantir que as experiências tenham campos de qualificação e percentual
ALTER TABLE "cv_experiences" ADD COLUMN IF NOT EXISTS "knowledge_percentage" INTEGER DEFAULT 0;
ALTER TABLE "cv_experiences" ADD COLUMN IF NOT EXISTS "qualifications" TEXT;

-- 3. Garantir consistência em Skills
ALTER TABLE "cv_skills" ADD COLUMN IF NOT EXISTS "percentage" INTEGER DEFAULT 0;
