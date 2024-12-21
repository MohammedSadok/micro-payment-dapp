CREATE TABLE "accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"publicKey" varchar(255) NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT NOW(),
	"updatedAt" timestamp DEFAULT NOW(),
	CONSTRAINT "accounts_publicKey_unique" UNIQUE("publicKey")
);
--> statement-breakpoint
CREATE TABLE "crypto_prices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric NOT NULL,
	"change24h" numeric NOT NULL,
	"chart" numeric[],
	"updatedAt" timestamp DEFAULT NOW(),
	CONSTRAINT "crypto_prices_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "favorite_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"publicKey" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"amount" numeric NOT NULL,
	"type" varchar(10) NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"toPublicKey" varchar(255) NOT NULL,
	"fromPublicKey" varchar(255) NOT NULL,
	"status" varchar(10) NOT NULL,
	"createdAt" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT NOW(),
	"updatedAt" timestamp DEFAULT NOW(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;