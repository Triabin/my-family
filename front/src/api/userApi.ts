import request from '@/common/request';
import type { UserDto } from '@/models/UserDto';

export function login(username: string, password: string): Promise<{ token: string, message: string }> {
  return request.post(
    '/login',
    { username, password }
  );
}

export function register(dto: UserDto) {
  return request.post(
    '/register',
    dto
  );
}
