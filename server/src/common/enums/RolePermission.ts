/**
 * 用户权限类型枚举
 */
enum RolePermission {
  /**
   * 0，无权限
   */
  NONE,
  /**
   * 1，可以修改自身信息
   */
  SELF,
  /**
   * 2，可以修改其他用户信息
   */
  USERINFO,
  /**
   * 3，可以修改用户角色类型以及添加角色等
   */
  ROLE

}

/**
 * 判断是否有权限
 * @param property 当前权限（位字段）
 * @param checkFor 要检查是否拥有的权限
 */
const hasPermission = (property: number, checkFor: RolePermission): boolean => {
  return (property & checkFor.valueOf()) !== 0;
}

/**
 * 添加权限
 * @param property 当前权限（位字段）
 * @param add 要添加的权限
 * @returns { number } 新的权限
 */
const addPermission = (property: number, add: RolePermission) => {
  if (hasPermission(property, add)) return property;
  return property | add.valueOf();
}

/**
 * 移除权限
 * @param property 当前权限（位字段）
 * @param remove 要移除的权限
 * @returns { number } 新的权限
 */
const removePermission = (property: number, remove: RolePermission) => {
  if (!hasPermission(property, remove)) return property;
  return property | ~remove.valueOf();
}

export default RolePermission;
export { hasPermission, addPermission, removePermission }
