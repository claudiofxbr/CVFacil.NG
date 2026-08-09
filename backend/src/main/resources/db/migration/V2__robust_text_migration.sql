-- Flyway Migration V2 - Robust Text Conversion for CVFacil.NG
-- This script converts all user-input fields from VARCHAR(255) to TEXT to prevent "Value too long" errors.

-- 1. cv_resumes
ALTER TABLE "cv_resumes" ALTER COLUMN "profession" TYPE TEXT;
ALTER TABLE "cv_resumes" ALTER COLUMN "title" TYPE TEXT;

-- 2. cv_experiences
ALTER TABLE "cv_experiences" ALTER COLUMN "company" TYPE TEXT;
ALTER TABLE "cv_experiences" ALTER COLUMN "job_position" TYPE TEXT;
ALTER TABLE "cv_experiences" ALTER COLUMN "start_date" TYPE TEXT;
ALTER TABLE "cv_experiences" ALTER COLUMN "end_date" TYPE TEXT;

-- 3. cv_educations
ALTER TABLE "cv_educations" ALTER COLUMN "institution" TYPE TEXT;
ALTER TABLE "cv_educations" ALTER COLUMN "degree" TYPE TEXT;
ALTER TABLE "cv_educations" ALTER COLUMN "field_of_study" TYPE TEXT;
ALTER TABLE "cv_educations" ALTER COLUMN "start_date" TYPE TEXT;
ALTER TABLE "cv_educations" ALTER COLUMN "end_date" TYPE TEXT;

-- 4. cv_skills
ALTER TABLE "cv_skills" ALTER COLUMN "name" TYPE TEXT;

-- 5. cv_languages
ALTER TABLE "cv_languages" ALTER COLUMN "name" TYPE TEXT;
ALTER TABLE "cv_languages" ALTER COLUMN "level" TYPE TEXT;

-- 6. cv_hobbies
ALTER TABLE "cv_hobbies" ALTER COLUMN "name" TYPE TEXT;
