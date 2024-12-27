"use server";
import { eq, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from ".";
import { accountsTable, transactionsTable } from "./schema";

type CreateTransactionInput = {
  accountId: string;
  amount: number;
  toPublicKey: string;
  fromPublicKey: string;
  description: string | null;
};

async function getOrCreateAccountByPublicKey(
  publicKey: string,
  userId: string
) {
  const account = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.publicKey, publicKey));

  if (account.length === 0) {
    const [newAccount] = await db
      .insert(accountsTable)
      .values({ id: userId, publicKey })
      .returning();
    return newAccount;
  }
  return account[0];
}

export async function createTransaction(
  input: CreateTransactionInput,
  userId: string
) {
  try {
    // Ensure source account exists
    const account = await getOrCreateAccountByPublicKey(
      input.fromPublicKey,
      userId
    );

    // Insert the transaction
    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        id: uuidv4(),
        ...input,
        accountId: account.publicKey,
        amount: input.amount.toString(),
      })
      .returning();

    return transaction;
  } catch (error) {
    console.error("Transaction Error:", error);
    throw new Error(`Failed to create transaction: ${error}`);
  }
}

export async function getTransactionsByAccountId(accountId: string) {
  try {
    return await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.accountId, accountId));
  } catch (error) {
    throw new Error(`Failed to get transactions: ${error}`);
  }
}

export async function getAccountByUserId(userId: string) {
  try {
    const account = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, userId));
    return account[0];
  } catch (error) {
    throw new Error(`Failed to get : ${error}`);
  }
}

export async function getTransactionsByPublicKey(publicKey: string) {
  try {
    return await db
      .select()
      .from(transactionsTable)
      .where(
        or(
          eq(transactionsTable.fromPublicKey, publicKey),
          eq(transactionsTable.toPublicKey, publicKey)
        )
      );
  } catch (error) {
    throw new Error(`Failed to get transactions by public key: ${error}`);
  }
}
