import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import db from '../index.ts';
import { eq } from 'drizzle-orm';
import logger from '../../config/logger.ts';
import RolePermission, { hasPermission } from '../../common/enums/RolePermission.ts';

/**
 * 角色表实体类
 */
class Role {
  /**
   * 构造函数
   * @param id        自增主键ID
   * @param roleName  角色名称
   * @param property  角色权限配置值，0为没有任何编辑权限，2^0即1为可编辑自身信息，2^1即2为可编辑其他用户信息，2^2即4为可修改用户权限，property为这些权限相加的结果
   * @param roleDesc  角色描述
   */
  constructor(
    public id: number,
    public roleName: string,
    public property: number,
    public roleDesc?: string
  ) {}

  /**
   * 检查角色是否具有指定权限
   * @param checkFor 要检查的权限
   * @returns {boolean} 是否具有指定权限
   */
  hasPermission(checkFor: RolePermission): boolean {
    return hasPermission(this.property, checkFor);
  }

  public static fromColumn(column: any) {
    return new Role(
      column.id,
      column.roleName,
      column.property,
      column.roleDesc,
    );
  }

  public static async hasPermission(roleId: number, checkFor: RolePermission) {
    const role = await findById(roleId);
    if (!role) return false;
    return role.hasPermission(checkFor);
  }
}

const mfRole = sqliteTable('mf_role', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  roleName: text('role_name', { mode: 'text' }).unique().notNull(),
  property: integer({ mode: 'number' }).notNull().default(0),
  roleDesc: text('role_desc', { mode: 'text' }),
});


async function add(role: Role): Promise<boolean> {
  return (await db.insert(mfRole).values(role)).rowsAffected === 1;
}

async function addBatch(list: Role[]): Promise<number> {
  if (list.length === 0) return 0;
  return (await db.insert(mfRole).values(list)).rowsAffected;
}

async function update(role: Role): Promise<boolean> {
  return (await db.update(mfRole).set(role).where(eq(mfRole.id, role.id))).rowsAffected === 1;
}

async function addOrUpdate(role: Role): Promise<boolean> {
  const exist = await findById(role.id);
  if (exist) {
    return update(role);
  } else {
    return add(role);
  }
}

async function deleteById(id: number): Promise<boolean> {
  const rowsAffected = (await db.delete(mfRole).where(eq(mfRole.id, id))).rowsAffected;
  if (rowsAffected > 1) {
    logger.warn(`重复ID角色已被删除，ID：${id}，共计删除${rowsAffected}条数据`);
  }
  return rowsAffected > 0;
}

async function findById(id: number): Promise<Role | undefined> {
  const result = await db.select().from(mfRole).where(eq(mfRole.id, id));
  if (result && result.length > 0) {
    const column = result[0];
    return Promise.resolve(Role.fromColumn(column));
  }
}

export default Role;
export { mfRole, add, addBatch, update, addOrUpdate, deleteById, findById };
