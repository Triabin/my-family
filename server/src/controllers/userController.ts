import type { Request, Response } from 'express';
import logger from '../config/logger.ts';
import User, { findById } from '../db/user/User.ts';
import { addUser } from '../services/userService.ts';

export async function createUser(req: Request<User>, res: Response) {
  // TODO: 验证权限
  try {
    const result = await addUser(req.body);
    if (!result) {
      return res.status(500).send('添加用户失败');
    } else {
      res.status(200).send('添加用户成功');
    }
  } catch (error) {
    logger.error(`添加用户失败，用户信息：${req.body}，错误信息：${error}`);
    res.status(500).send('添加用户失败')
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
