import request from '@/common/request';
import type { UserDto } from '@/models/UserDto';
import type UserVO from '@/models/UserVO';

export function login(username: string, password: string) {
  return request.post<{ token: string, message: string }>(
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

export function getAllUser() {
  return request.post<UserVO[]>('/get-all-user');
}
