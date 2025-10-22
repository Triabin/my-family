import RelationType from '@/common/enums/RelationType';

/**
 * 成员关系描述模型
 */
export type Relation = {
  id: number,
  relationType: RelationType,
  relationLabel: string,
  name: string,
}

/**
 * 用户实例数据流转模型
 */
export type UserDto = {
  username: string,
  password: string,
  name: string,
  gender?: 'male' | 'female',
  generation: number,
  relations?: Relation[],
  birthday?: string,
  deathday?: string,
  biography?: string,
  roleId: number,
}
