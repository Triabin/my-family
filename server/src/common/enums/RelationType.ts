/**
 * 关系类型（只直接管理一代之内的直系，自定义的其他情况除外）
 */
enum RelationType {
  /** 父 */
  FATHER,
  /** 母 */
  MOTHER,
  /** 兄弟 */
  BROTHER,
  /** 姐妹 */
  SISTER,
  /** 夫 */
  HUSBAND,
  /** 妻 */
  WIFE,
  /** 儿子 */
  SON,
  /** 女儿 */
  DAUGHTER,
  /** 其他 */
  OTHER
}

export default RelationType;
