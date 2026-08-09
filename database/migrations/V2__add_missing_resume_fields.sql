-- Migration to add missing tables and fields for Resume completeness
-- Author: Antigravity AI Engineer

-- Add missing fields to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS profession VARCHAR(255);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS contact_email VARCHAR(100);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS layout_id VARCHAR(50) DEFAULT 'minimalist';
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS primary_color VARCHAR(20);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(20);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS bg_color VARCHAR(20);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS text_color VARCHAR(20);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS font_family VARCHAR(50);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS font_size INTEGER;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS line_height DOUBLE PRECISION;

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50), -- Beginner, Intermediate, Expert
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL, -- Fluent, Advanced, etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Hobbies Table
CREATE TABLE IF NOT EXISTS hobbies (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_resume ON skills(resume_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_languages_resume ON languages(resume_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hobbies_resume ON hobbies(resume_id) WHERE deleted_at IS NULL;
