import { v1 as uuid } from 'uuid';
import { decodeJwt } from 'jose';

export const generateUUID = () => uuid().replaceAll('-', '');

/**
 * 从token中获取登录用户信息
 * @returns 登录用户信息
 */
export function getLoginUserInfoFromToken(authorization: string) {
  if (!authorization) return undefined;
  const [_, token] = authorization.split(' ');
  if (!token) return undefined;
  const metadata = decodeJwt(token);
  return metadata as { id: string, roleId: number, name: string, username: string };
}
