-- Adiciona campos para metadados de design e templates dinâmicos
ALTER TABLE cv_resumes ADD COLUMN IF NOT EXISTS template_style VARCHAR(50) DEFAULT 'Corporativo';
ALTER TABLE cv_resumes ADD COLUMN IF NOT EXISTS font_family VARCHAR(50) DEFAULT 'Inter';
ALTER TABLE cv_resumes ADD COLUMN IF NOT EXISTS font_size INTEGER DEFAULT 12;
ALTER TABLE cv_resumes ADD COLUMN IF NOT EXISTS line_height DECIMAL(3,2) DEFAULT 1.5;
