import { db } from ".";
import { usersTable } from "./schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export type CreateUserInput = {
  name: string;
  email: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

// Create
export async function createUser(input: CreateUserInput) {
  try {
    const [user] = await db
      .insert(usersTable)
      .values({
        id: uuidv4(),
        ...input,
      })
      .returning();
    return user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error}`);
  }
}

// Read
export async function getUserById(id: string) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`);
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(usersTable);
  } catch (error) {
    throw new Error(`Failed to get users: ${error}`);
  }
}

// Update
export async function updateUser(id: string, input: UpdateUserInput) {
  try {
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`);
  }
}

// Delete
export async function deleteUser(id: string) {
  try {
    const [deletedUser] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error}`);
  }
}
