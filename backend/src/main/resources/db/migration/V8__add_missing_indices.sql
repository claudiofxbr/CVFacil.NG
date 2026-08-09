-- V8: Add missing indices on foreign keys for child tables to resolve slow queries
-- This improves performance when loading entire resumes with their associations.

-- Index for Experiences
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON cv_experiences (resume_id);

-- Index for Educations
CREATE INDEX IF NOT EXISTS idx_educations_resume_id ON cv_educations (resume_id);

-- Index for Skills
CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON cv_skills (resume_id);

-- Index for Languages
CREATE INDEX IF NOT EXISTS idx_languages_resume_id ON cv_languages (resume_id);

-- Index for Hobbies
CREATE INDEX IF NOT EXISTS idx_hobbies_resume_id ON cv_hobbies (resume_id);
