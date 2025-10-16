import type { NextFunction, Request, Response } from 'express';
import { pinoHttpMiddlewareCfg } from '../config/logger.ts';
import { jwtVerify } from 'jose';

/**
 * 自定义中间件，记录API接口的请求日志
 */
export function pinoHttpMiddleware(req: Request, res: Response, next: NextFunction) {
  // 只记录API接口的请求日志，忽略静态资源请求
  if (req.url.startsWith('/api')) {
    pinoHttpMiddlewareCfg(req, res, next);
  } else {
    next();
  }
}

/**
 * 自定义中间件，验证token
 */
export async function authorizationMiddleware(req: Request, res: Response, next: NextFunction) {
  // 放行登录、注册、登录页面等接口
  if (req.url.startsWith('/api/login') || req.url.startsWith('/api/register') || req.url.startsWith('/login')) {
    return next();
  }
  // 验证token
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('Not authorized');
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided');
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).send('JWT_SECRET not set');
  }
  const encodedSecret = new TextEncoder().encode(JWT_SECRET);
  try {
    await jwtVerify(token, encodedSecret);
    next();
  } catch (err) {
    return res.status(401).send(err || 'Unauthorized');
  }
}
