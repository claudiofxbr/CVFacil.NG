-- Deep Search and Analysis Robust Schema for CVFacil.NG

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft Delete
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE, -- Business Rule: Main resume
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft Delete
);

-- Professional Experiences
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    CONSTRAINT check_experience_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Academic Education
CREATE TABLE IF NOT EXISTS educations (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    CONSTRAINT check_education_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Robust Indexing Strategy
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_resumes_public ON resumes(is_public) WHERE is_public = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_experiences_resume ON experiences(resume_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_educations_resume ON educations(resume_id) WHERE deleted_at IS NULL;

-- Business Logic: Only one primary resume per user (where not deleted)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_primary_resume ON resumes(user_id) 
WHERE is_primary = TRUE AND deleted_at IS NULL;
