import type { Relation } from '@/models/UserDto.ts';

class UserVO {
  /**
   * 构造函数
   * @param id          32位UUID主键
   * @param username    登录用户名
   * @param name        姓名
   * @param gender      性别，male、female
   * @param generation  代数
   * @param relations   关系数组
   * @param birthday    出生日期
   * @param alive       是否在世
   * @param deathday    死亡日期
   * @param biography   生平
   * @param roleId      角色ID
   * @param lastLogin   最后登录时间
   * @param updatedAt    更新时间
   * @param createdAt   创建时间
   */
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public roleId: number,
    public generation: number,
    public gender?: 'male' | 'female',
    public relations?: Relation[],
    public alive?: boolean,
    public birthday?: Date,
    public deathday?: Date,
    public biography?: string,
    public lastLogin?: Date,
    public updatedAt?: Date,
    public createdAt?: Date,
  ) {}
}

export default UserVO;
