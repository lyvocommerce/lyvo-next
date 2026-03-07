-- Enable pg_trgm extension for fuzzy/similarity search (language-agnostic).
-- For an existing DB not using Prisma migrate, run in SQL:
--   CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
