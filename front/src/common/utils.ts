/**
 * 从token中获取用户信息
 * @returns 用户信息
 */
export function getUserInfoFromToken(): { id: string, roleId: number, name: string, username: string } | undefined {
  const token = localStorage.getItem('token');
  if (!token) {
    return undefined;
  }
  const [header, payload, signature] = token.split('.');
  if (!payload) {
    return undefined;
  }
  return JSON.parse(atob(payload));
}
