-- V9: Optimize performance for filtered queries on resumes
-- Added indices for public accessibility and soft delete filters

-- Index for public resumes (common for the gallery/public links)
CREATE INDEX IF NOT EXISTS idx_resumes_is_public ON cv_resumes (is_public);

-- Index for soft delete filtering
CREATE INDEX IF NOT EXISTS idx_resumes_deleted_at ON cv_resumes (deleted_at);

-- Combined index for user specific active resumes (most common query)
CREATE INDEX IF NOT EXISTS idx_resumes_user_active ON cv_resumes (user_id, deleted_at);
