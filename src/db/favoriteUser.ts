"use server";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from ".";
import { favoriteUsersTable, transactionsTable } from "./schema";

export type CreateFavoriteUserInput = {
  userId: string;
  name: string;
  publicKey: string;
};

export type UpdateFavoriteUserInput = Partial<CreateFavoriteUserInput>;

export async function getFavoriteUsersWithTotals(userId: string) {
  try {
    const result = await db
      .select({
        id: favoriteUsersTable.id,
        name: favoriteUsersTable.name,
        publicKey: favoriteUsersTable.publicKey,
        totalSent: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${transactionsTable.fromPublicKey} = ${favoriteUsersTable.publicKey} 
            THEN ${transactionsTable.amount} 
            ELSE 0 
          END), 0)`,
        totalReceived: sql<number>`
          COALESCE(SUM(CASE 
            WHEN ${transactionsTable.toPublicKey} = ${favoriteUsersTable.publicKey} 
            THEN ${transactionsTable.amount} 
            ELSE 0 
          END), 0)`,
      })
      .from(favoriteUsersTable)
      .leftJoin(
        transactionsTable,
        sql`${transactionsTable.fromPublicKey} = ${favoriteUsersTable.publicKey} OR 
            ${transactionsTable.toPublicKey} = ${favoriteUsersTable.publicKey}`
      )
      .where(eq(favoriteUsersTable.userId, userId))
      .groupBy(
        favoriteUsersTable.id,
        favoriteUsersTable.name,
        favoriteUsersTable.publicKey
      );

    return result;
  } catch (error) {
    throw new Error(`Failed to get favorite users with totals: ${error}`);
  }
}
// Create
export async function createFavoriteUser(input: CreateFavoriteUserInput) {
  try {
    const [favoriteUser] = await db
      .insert(favoriteUsersTable)
      .values({
        id: uuidv4(),
        ...input,
      })
      .returning();
    return favoriteUser;
  } catch (error) {
    throw new Error(`Failed to create favorite user: ${error}`);
  }
}

// Read
export async function getFavoriteUserById(id: string) {
  try {
    const [favoriteUser] = await db
      .select()
      .from(favoriteUsersTable)
      .where(eq(favoriteUsersTable.id, id));
    return favoriteUser;
  } catch (error) {
    throw new Error(`Failed to get favorite user: ${error}`);
  }
}

export async function getFavoriteUsersByUserId(userId: string) {
  try {
    return await db
      .select()
      .from(favoriteUsersTable)
      .where(eq(favoriteUsersTable.userId, userId));
  } catch (error) {
    throw new Error(`Failed to get favorite users: ${error}`);
  }
}

// Update
export async function updateFavoriteUser(
  id: string,
  input: UpdateFavoriteUserInput
) {
  try {
    const [updatedFavoriteUser] = await db
      .update(favoriteUsersTable)
      .set(input)
      .where(eq(favoriteUsersTable.id, id))
      .returning();
    return updatedFavoriteUser;
  } catch (error) {
    throw new Error(`Failed to update favorite user: ${error}`);
  }
}

// Delete
export async function deleteFavoriteUser(id: string) {
  try {
    const [deletedFavoriteUser] = await db
      .delete(favoriteUsersTable)
      .where(eq(favoriteUsersTable.id, id))
      .returning();
    return deletedFavoriteUser;
  } catch (error) {
    throw new Error(`Failed to delete favorite user: ${error}`);
  }
}
