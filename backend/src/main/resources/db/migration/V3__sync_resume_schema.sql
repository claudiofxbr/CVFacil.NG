-- Flyway Migration V3 - Schema Synchronization for CVFacil.NG 
-- This script adds missing columns to support theme colors, social links, and enhanced experience details.

-- 1. Update cv_resumes
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "linkedin_url" TEXT;
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "professional_qualifications" TEXT;
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "full_name" TEXT;
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "primary_color" VARCHAR(50) DEFAULT '#2563eb';
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "secondary_color" VARCHAR(50) DEFAULT '#1e40af';
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "bg_color" VARCHAR(50) DEFAULT '#ffffff';
ALTER TABLE "cv_resumes" ADD COLUMN IF NOT EXISTS "text_color" VARCHAR(50) DEFAULT '#333333';

-- 2. Update cv_experiences
ALTER TABLE "cv_experiences" ADD COLUMN IF NOT EXISTS "knowledge_percentage" INTEGER DEFAULT 0;
ALTER TABLE "cv_experiences" ADD COLUMN IF NOT EXISTS "qualifications" TEXT;
