-- Rename existing user table to app_user to avoid conflict with Better Auth
ALTER TABLE "user" RENAME TO "app_user";

-- Update constraints to match new table name
ALTER TABLE "app_user" RENAME CONSTRAINT "user_username_unique" TO "app_user_username_unique";
ALTER TABLE "app_user" RENAME CONSTRAINT "user_email_unique" TO "app_user_email_unique";