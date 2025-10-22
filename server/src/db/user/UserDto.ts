import { Relation } from './User.ts';

/**
 * 用户实例数据流转模型
 */
type UserDto = {
  username: string,
  password: string,
  name: string,
  gender?: 'male' | 'female',
  generation: number,
  relations?: Relation[],
  alive?: boolean,
  birthday?: string,
  deathday?: string,
  biography?: string,
  roleId: number,
}

export default UserDto;
