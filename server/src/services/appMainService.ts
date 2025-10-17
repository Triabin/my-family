import { findByKey } from "../db/APPMain.ts";
import { APP_KEY_IS_INIT } from '../common/constant.ts';

export async function isInitialized(): Promise<boolean> {
  const result = await findByKey(APP_KEY_IS_INIT);
  return !(!result || result.value === 'true');
}
