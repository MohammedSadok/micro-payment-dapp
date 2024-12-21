import { sql } from "drizzle-orm";
import {
  decimal,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().default(sql`NOW()`),
  updatedAt: timestamp().default(sql`NOW()`),
});

export const accountsTable = pgTable("accounts", {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  publicKey: varchar({ length: 255 }).notNull().unique(),
  balance: decimal().notNull().default("0"),
  createdAt: timestamp().default(sql`NOW()`),
  updatedAt: timestamp().default(sql`NOW()`),
});

export const transactionsTable = pgTable("transactions", {
  id: varchar({ length: 255 }).primaryKey(),
  accountId: varchar({ length: 255 })
    .notNull()
    .references(() => accountsTable.id),
  amount: decimal().notNull(),
  type: varchar({ length: 10 }).notNull(),
  date: timestamp().notNull(),
  description: text(),
  toPublicKey: varchar({ length: 255 }).notNull(),
  fromPublicKey: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 10 }).notNull(),
  createdAt: timestamp().default(sql`NOW()`),
});

export const favoriteUsersTable = pgTable("favorite_users", {
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),
  publicKey: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().default(sql`NOW()`),
});

export const cryptoPricesTable = pgTable("crypto_prices", {
  id: varchar({ length: 255 }).primaryKey(),
  symbol: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  price: decimal().notNull(),
  change24h: decimal().notNull(),
  chart: decimal().array(),
  updatedAt: timestamp().default(sql`NOW()`),
});
