import { sql } from "drizzle-orm";
import {
  decimal,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const accountsTable = pgTable("accounts", {
  id: varchar({ length: 255 }).primaryKey(),
  publicKey: varchar({ length: 255 }).notNull().unique(),
  balance: decimal().notNull().default("0"),
});

export const transactionsTable = pgTable("transactions", {
  id: varchar({ length: 255 }).primaryKey(),
  accountId: varchar({ length: 255 })
    .notNull()
    .references(() => accountsTable.publicKey),
  amount: decimal().notNull(),
  description: text(),
  toPublicKey: varchar({ length: 255 }).notNull(),
  fromPublicKey: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().default(sql`NOW()`),
});

export const favoriteUsersTable = pgTable("favorite_users", {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  publicKey: varchar({ length: 255 }).notNull(),
});
