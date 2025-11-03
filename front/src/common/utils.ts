import { logout } from '@/api/userApi';

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

export function handleLogout() {
  logout().then(resp => {
    if (resp.status === 200) {
      localStorage.removeItem('token');
      window.location.href = '/#/login';
    }
  });
}
