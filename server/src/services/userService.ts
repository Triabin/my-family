import { mfUser } from '../db/schema.ts';
import db from '../db/index.ts';
import { eq, sql } from 'drizzle-orm';
import User, { findByUsername, add } from "../db/user/User.ts";
import type UserDto from "../db/user/UserDto.ts";
import type { Request, Response } from 'express';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

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

/**
 * 注册
 */
export async function register(req: Request<UserDto>, res: Response) {
  debugger;
  // 1、判重
  const userDto: UserDto = req.body;
  const existingUser = await findByUsername(userDto.username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  // 2、加密密码
  let salt = process.env.SALT || 10;
  if (!Number.isNaN(salt)) {
    salt = Number(salt);
  }
  const user = User.fromDto(userDto);
  user.password = await bcrypt.hash(user.password, salt);

  // 3、插入数据库
  const result = await add(user);
  if (result) {
    const resp = { message: 'User created successfully', token: '' };
    // 4、生成token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      resp.message += ', but JWT_SECRET not set, so token not generated';
    } else {
      const encodedSecret = new TextEncoder().encode(JWT_SECRET);
      const token = await new SignJWT()
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime('7d')
        .sign(encodedSecret);
      // res.setHeader('Authorization', `Bearer ${token}`);
      resp.token = token;
    }
    return res.status(201).json(resp);
  } else {
    return res.status(400).json({ message: 'User already exists' });
  }
}

/**
 * 登录
 */
export async function login(req: Request<{ username: string, password: string }>, res: Response) {
  // 1、验证用户名
  const { username, password } = req.body;
  const user = await findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // 2、验证密码
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // 3、生成token
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).send('JWT_SECRET not set');
  }
  const encodedSecret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(encodedSecret);
  res.setHeader('Authorization', `Bearer ${token}`);
  res.json({ message: 'Login successful', token });
}
