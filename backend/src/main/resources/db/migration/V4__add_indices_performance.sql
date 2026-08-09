-- V4: Performance Optimization Indices for CVFacil.NG --

-- Índice composto para listagem de currículos (Ativos e Lixeira)
-- Melhora queries do tipo: WHERE user_id = ? AND deleted_at IS NULL
CREATE INDEX IF NOT EXISTS idx_resumes_user_deleted ON cv_resumes (user_id, deleted_at);

-- Índice para busca de currículos por título (Busca textual rápida)
CREATE INDEX IF NOT EXISTS idx_resumes_title ON cv_resumes (title);

-- Índice para currículos públicos (SEO e Visualização Externa)
CREATE INDEX IF NOT EXISTS idx_resumes_is_public ON cv_resumes (is_public) WHERE is_public = true;

-- Índice para ordenação por data de atualização (Dashboard Sort)
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON cv_resumes (updated_at DESC);
