ALTER TABLE "crypto_prices" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "crypto_prices" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favorite_users" DROP CONSTRAINT "favorite_users_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "favorite_users" DROP COLUMN "createdAt";