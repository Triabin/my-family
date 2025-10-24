import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { asc, eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import type UserDto from "../db/user/UserDto.ts";
import User, { add, findByUsername } from "../db/user/User.ts";
import Role from '../db/role/Role.ts';
import RolePermission from '../common/enums/RolePermission.ts';
import { getLoginUserInfoFromToken } from '../common/utils.ts';
import { mfUser } from '../db/schema.ts';
import db from '../db/index.ts';

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
  return db.select()
    .from(mfUser)
    .where(eq(mfUser.deleted, false))
    .orderBy(asc(mfUser.generation));
}

/**
 * 注册
 */
export async function register(req: Request<UserDto>, res: Response) {
  // 0、鉴权
  const loginUser = getLoginUserInfoFromToken(req.headers.authorization || '');
  if (!loginUser) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const hasPermission = await Role.hasPermission(loginUser.roleId, RolePermission.USERINFO);
  if (!hasPermission) {
    return res.status(401).send({ message: 'You have no permission to add user' });
  }
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
    return res.status(201).json({ message: 'User created successfully' });
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
  const token = await new SignJWT({ id: user.id, roleId: user.roleId, name: user.name, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(encodedSecret);
  
  // 4、更新数据库
  const result = await db.update(mfUser).set({ lastLogin: new Date() }).where(eq(mfUser.id, user.id));
  if (result.rowsAffected === 0) {
    return res.status(400).send({ message: 'Login failed, user not found' });
  }
  
  res.setHeader('Authorization', `Bearer ${token}`);
  res.json({ message: 'Login successful', token });
}

/**
 * 注销登录
 */
export async function logout(req: Request, res: Response) {
  // 1、验证token
  const loginUser = getLoginUserInfoFromToken(req.headers.authorization || '');
  if (!loginUser) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const result = await db.update(mfUser).set({ lastLogin: new Date() }).where(eq(mfUser.id, loginUser.id));
  if (result.rowsAffected === 0) {
    return res.status(400).send({ message: 'Logout failed' });
  }
  res.setHeader('Authorization', '');
  res.json({ message: 'Logout successful' });
}
