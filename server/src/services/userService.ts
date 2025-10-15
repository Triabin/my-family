import {mfUser} from '../db/schema.ts';
import db from '../db/index.ts';
import {eq, sql} from 'drizzle-orm';
import User from "../db/user/User.ts";

export async function addUser(user: User) {
  const result = await db.insert(mfUser).values(user);
  return result.rowsAffected;
}

export async function logicDeleteUser(id: string) {
  const result = await db.update(mfUser).set({ deleted: true });
  return result.rowsAffected;
}

export async function deleteUser(id: string) {
  const result = await db.delete(mfUser).where(eq(mfUser.id, id));
  return result.rowsAffected;
}

export async function allUsers() {
  return db.select().from(mfUser).orderBy(sql`${mfUser.generation} ASC`);
}
