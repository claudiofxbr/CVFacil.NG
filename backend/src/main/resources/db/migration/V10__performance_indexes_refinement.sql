-- V10: Refinement of performance indexes for resume sub-entities
-- Ensures fast joins and cascade operations

-- Indices for Resume sub-entities
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON cv_experiences (resume_id);
CREATE INDEX IF NOT EXISTS idx_educations_resume_id ON cv_educations (resume_id);
CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON cv_skills (resume_id);
CREATE INDEX IF NOT EXISTS idx_languages_resume_id ON cv_languages (resume_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_resume_id ON cv_hobbies (resume_id);

-- Soft delete index for users
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON cv_users (deleted_at);

-- Combined active user lookup (email/username + soft delete)
CREATE INDEX IF NOT EXISTS idx_users_email_active ON cv_users (email, deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_username_active ON cv_users (username, deleted_at);
