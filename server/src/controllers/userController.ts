import type { Request, Response } from 'express';
import logger from '../config/logger.ts';
import User, { findById } from '../db/user/User.ts';
import type UserDto from '../db/user/UserDto.ts';
import { register as registerService, login as loginService } from '../services/userService.ts';

export async function register(req: Request<UserDto>, res: Response) {
  try {
    return await registerService(req, res);
  } catch (error) {
    logger.error(`添加用户失败，用户信息：${JSON.stringify(req.body)}，错误信息：${error}`);
    res.status(500).send(`添加用户失败，错误信息：${error}`);
  }
}

export async function login(req: Request<{ username: string, password: string }>, res: Response) {
  try {
    return await loginService(req, res);
  } catch (error) {
    logger.error(`登录失败，用户信息：${req.body}，错误信息：${error}`);
    res.status(500).send('登录失败')
  }
}

export async function findUser(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const user = await findById(id);
  if (!user) {
    res.status(500).send('用户不存在');
  } else {
    res.status(200).send(user);
  }
}
