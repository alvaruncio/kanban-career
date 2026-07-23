-- Set default value for new rows
ALTER TABLE "User" ALTER COLUMN "avatarUrl" SET DEFAULT 'https://www.svgrepo.com/svg/335455/profile-default';

-- Backfill existing NULL rows
UPDATE "User" SET "avatarUrl" = 'https://www.svgrepo.com/svg/335455/profile-default' WHERE "avatarUrl" IS NULL;

-- Now make the column required
ALTER TABLE "User" ALTER COLUMN "avatarUrl" SET NOT NULL;
