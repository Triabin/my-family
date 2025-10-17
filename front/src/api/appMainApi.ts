import request from '@/common/request';

export function getFamilyName(): Promise<string> {
  return request.get('/family-name');
}
