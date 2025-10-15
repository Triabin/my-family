-- 用户表
CREATE TABLE IF NOT EXISTS `mf_user` (
    `id` TEXT(32) PRIMARY KEY,                                      -- 32位UUID主键
    `username` TEXT NOT NULL UNIQUE,                                -- 登录用户名
    `password` TEXT NOT NULL,                                       -- 登录密码
    `name` TEXT NOT NULL,                                           -- 姓名
    `gender` TEXT,                                                  -- 性别，male、female
    `generation` INT NOT NULL,                                      -- 代数
    `relations` TEXT,                                               -- 关系，{ id: number, name: string, relationLabel: string, relationType: string }[]
    `birthday` DATETIME,                                            -- 出生日期
    `deathday` DATETIME,                                            -- 死亡日期
    `role_id` INTEGER NOT NULL,                                     -- 角色ID
    `last_login` DATETIME,                                          -- 最后登录时间
    `deleted` INTEGER DEFAULT (0),                                  -- 删除状态，0未删除，1已删除
    `updated_at` DATETIME DEFAULT (DATETIME('now', 'localtime')),   -- 更新时间
    `created_at` DATETIME DEFAULT (DATETIME('now', 'localtime'))    -- 创建时间
);
-- 创建触发器
CREATE TRIGGER IF NOT EXISTS update_user_trigger
    AFTER UPDATE ON `mf_user`
BEGIN
    UPDATE `mf_user` SET `updated_at` = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;
-- 插入初始化用户数据
INSERT INTO `mf_user` (`id`, `username`, `password`, `name`, `generation`, `role_id`) VALUES ('DB5C609E55B641D392B77E62C77DA6C8', 'root', '', 'root', 0, 0);

-- 角色表
CREATE TABLE IF NOT EXISTS `mf_role` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT, -- 自增主键
    `role_name` TEXT NOT NULL UNIQUE,       -- 角色名称
    `role_desc` TEXT,                       -- 角色描述
    `property` INTEGER DEFAULT (0)          -- 角色属性
);
-- 插入初始化角色数据
INSERT INTO `mf_role` (`id`, `role_name`, `role_desc`, `property`) VALUES (0, 'root', 'root', 7);
INSERT INTO `mf_role` (`id`, `role_name`, `role_desc`, `property`) VALUES (1, 'admin', '管理员', 3);
INSERT INTO `mf_role` (`id`, `role_name`, `role_desc`, `property`) VALUES (2, 'member', '普通成员', 1);

-- 应用主配置表
CREATE TABLE IF NOT EXISTS `mf_app_main`(
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,                         -- 自增主键
    `key` TEXT NOT NULL UNIQUE,                                     -- 配置项键
    `value` TEXT NOT NULL,                                          -- 配置项值
    `description` TEXT,                                             -- 配置项描述
    `updated_at` DATETIME DEFAULT (DATETIME('now', 'localtime')),   -- 更新时间
    `created_at` DATETIME DEFAULT (DATETIME('now', 'localtime'))    -- 创建时间
);
-- 创建触发器
CREATE TRIGGER IF NOT EXISTS update_app_main_trigger
    AFTER UPDATE ON `mf_app_main`
BEGIN
    UPDATE `mf_app_main` SET `updated_at` = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;
-- 插入初始化应用数据
