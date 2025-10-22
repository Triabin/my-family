import request from '@/common/request';

export function getFamilyName() {
  return request.get<string>('/family-name');
}
