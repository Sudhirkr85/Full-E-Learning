-- Drop `bio` column from users if it exists
ALTER TABLE "users" DROP COLUMN IF EXISTS "bio";
