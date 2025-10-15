import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';
import db from './index.ts';
import logger from '../config/logger.ts';

/**
 * 应用配置主表实体类
 */
class APPMain {
  /**
   * 构造函数
   * @param id 自增主键
   * @param key 唯一标识符
   * @param value 配置值
   * @param description 配置描述
   * @param updatedAt 更新时间
   * @param createdAt 创建时间
   */
  constructor(
    public id: number,
    public key: string,
    public value: string,
    public description?: string,
    public updatedAt?: Date,
    public createdAt?: Date
  ) {}

  public static fromColumn(column: any) {
    return new APPMain(
      column.id,
      column.key,
      column.value,
      column.description,
      column.updatedAt,
      column.createdAt
    );
  }
}

const mfAPPMain = sqliteTable('mf_app_main', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  key: text({ mode: 'text' }).unique().notNull(),
  value: text({ mode: 'text' }).notNull(),
  description: text({ mode: 'text' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`(DATETIME('now', 'localtime'))`),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(DATETIME('now', 'localtime'))`)
});

async function add(appMain: APPMain): Promise<boolean> {
  return (await db.insert(mfAPPMain).values(appMain)).rowsAffected === 1;
}

async function addBatch(list: APPMain[]): Promise<number> {
  if (list.length === 0) return 0;
  return (await db.insert(mfAPPMain).values(list)).rowsAffected;
}

async function update(appMain: APPMain): Promise<boolean> {
  return (await db.update(mfAPPMain).set(appMain).where(eq(mfAPPMain.id, appMain.id))).rowsAffected === 1;
}

async function addOrUpdate(appMain: APPMain): Promise<boolean> {
  const exist = await findById(appMain.id);
  if (exist) {
    return update(appMain);
  } else {
    return add(appMain);
  }
}

async function deleteById(id: number): Promise<boolean> {
  const rowsAffected = (await db.delete(mfAPPMain).where(eq(mfAPPMain.id, id))).rowsAffected;
  if (rowsAffected > 1) {
    logger.warn(`重复ID角色已被删除，ID：${id}，共计删除${rowsAffected}条数据`);
  }
  return rowsAffected > 0;
}

async function findById(id: number): Promise<APPMain | undefined> {
  const result = await db.select().from(mfAPPMain).where(eq(mfAPPMain.id, id));
  if (result && result.length > 0) {
    const column = result[0];
    return Promise.resolve(APPMain.fromColumn(column));
  }
}

async function findByKey(key: string): Promise<APPMain | undefined> {
  const result = await db.select().from(mfAPPMain).where(eq(mfAPPMain.key, key));
  if (result && result.length > 0) {
    const column = result[0];
    return Promise.resolve(APPMain.fromColumn(column));
  }
}

export default APPMain;
export { mfAPPMain, add, addBatch, update, addOrUpdate, deleteById, findById, findByKey };
