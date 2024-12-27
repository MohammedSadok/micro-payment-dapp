CREATE TABLE "accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"publicKey" varchar(255) NOT NULL,
	"balance" numeric DEFAULT '0' NOT NULL,
	CONSTRAINT "accounts_publicKey_unique" UNIQUE("publicKey")
);
--> statement-breakpoint
CREATE TABLE "favorite_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"publicKey" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"amount" numeric NOT NULL,
	"description" text,
	"toPublicKey" varchar(255) NOT NULL,
	"fromPublicKey" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT NOW()
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;