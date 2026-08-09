-- Migration V7: Add photo_url to cv_users
-- Fix for profile lookup feature in Titanium Login Premium

ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Update description to reflect change in history if needed
COMMENT ON COLUMN cv_users.photo_url IS 'URL for user profile picture/avatar';
