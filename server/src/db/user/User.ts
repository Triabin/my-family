import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql, eq } from 'drizzle-orm';
import RelationType from '@/common/enums/RelationType.ts';
import { generateUUID } from '@/common/utils.ts';
import db from '../index.ts';
import logger from "../../config/logger.ts";
import type UserDto from '../user/UserDto.ts';

/**
 * 用户表实体类，表名：mf_user
 */
class User {
  /**
   * 构造函数
   * @param id          32位UUID主键
   * @param username    登录用户名
   * @param password    登录密码（密文）
   * @param name        姓名
   * @param gender      性别，male、female
   * @param generation  代数
   * @param relations   关系数组
   * @param birthday    出生日期
   * @param deathday    死亡日期
   * @param roleId      角色ID
   * @param lastLogin   最后登录时间
   * @param deleted     删除状态
   * @param updateAt    更新时间
   * @param createdAt   创建时间
   */
  constructor(
    public id: string,
    public username: string,
    public password: string,
    public name: string,
    public roleId: number,
    public deleted: boolean,
    public generation: number,
    public gender?: 'male' | 'female',
    public relations?: Relation[],
    public birthday?: Date,
    public deathday?: Date,
    public lastLogin?: Date,
    public updateAt?: Date,
    public createdAt?: Date,
  ) {}

  public static fromColumn(column: any) {
    return new User(
      column.id,
      column.username,
      column.password,
      column.name,
      column.roleId,
      column.deleted,
      column.generation,
      column.gender || undefined,
      column.relations? JSON.parse(column.relations) : undefined,
      column.birthday? new Date(column.birthday) : undefined,
      column.deathday? new Date(column.deathday) : undefined,
      column.lastLogin? new Date(column.lastLogin) : undefined,
      column.updatedAt? new Date(column.updatedAt) : undefined,
      column.createdAt? new Date(column.createdAt) : undefined,
    );
  }

  public static fromDto(dto: UserDto) {
    const birthday = dto.birthday ? new Date(dto.birthday) : undefined;
    const deathday = dto.deathday ? new Date(dto.deathday) : undefined;
    return new User(
      generateUUID(),
      dto.username,
      dto.password,
      dto.name,
      dto.roleId,
      false,
      dto.generation,
      dto.gender,
      dto.relations || undefined,
      birthday,
      deathday,
    );
  }
}

/**
 * 成员关系描述模型
 */
type Relation = {
  id: number,
  relationType: RelationType,
  relationLabel: string,
  name: string,
}

/**
 * 数据库表定义
 */
const mfUser = sqliteTable("mf_user", {
  id: text({ mode: 'text', length: 32 }).primaryKey().$defaultFn(() => generateUUID()),
  username: text({ mode: 'text' }).unique().notNull(),
  password: text({ mode: 'text' }).notNull(),
  name: text({ mode: 'text' }).notNull(),
  gender: text({ enum: ['male', 'female'] }),
  generation: integer({ mode: 'number' }).notNull(),
  relations: text({ mode: 'json' }).$type<Relation[]>(),
  birthday: integer({ mode: 'timestamp' }),
  deathday: integer({ mode: 'timestamp' }),
  roleId: integer('role_id', { mode: 'number' }).notNull(),
  lastLogin: integer('last_login', { mode: 'timestamp_ms' }),
  deleted: integer({ mode: 'boolean' }).default(false).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(DATETIME('now', 'localtime'))`),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(DATETIME('now', 'localtime'))`)
});

async function add(user: User): Promise<boolean> {
  return (await db.insert(mfUser).values(user)).rowsAffected === 1;
}

async function addBatch(list: User[]): Promise<number> {
  if (list.length === 0) return 0;
  return (await db.insert(mfUser).values(list)).rowsAffected;
}

async function update(user: User): Promise<boolean> {
  return (await db.update(mfUser).set(user).where(eq(mfUser.id, user.id))).rowsAffected === 1;
}

async function addOrUpdate(user: User): Promise<boolean> {
  const exist = await findById(user.id);
  if (exist) {
    return update(user);
  } else {
    return add(user);
  }
}

async function deleteById(id: string): Promise<boolean> {
  const rowsAffected = (await db.delete(mfUser).where(eq(mfUser.id, id))).rowsAffected;
  if (rowsAffected > 1) {
    logger.warn(`重复ID用户已被删除，ID：${id}，共计删除${rowsAffected}条数据`);
  }
  return rowsAffected > 0;
}

async function findById(id: string): Promise<User | undefined> {
  const result = await db.select().from(mfUser).where(eq(mfUser.id, id));
  if (result && result.length > 0) {
    const column = result[0];
    return Promise.resolve(User.fromColumn(column));
  }
}

async function findByUsername(username: string): Promise<User | undefined> {
  const result = await db.select().from(mfUser).where(eq(mfUser.username, username));
  if (result && result.length > 0) {
    const column = result[0];
    return Promise.resolve(User.fromColumn(column));
  }
}

export default User;
export {
  type Relation,
  mfUser,
  add,
  addOrUpdate,
  addBatch,
  update,
  deleteById,
  findById,
  findByUsername
};
