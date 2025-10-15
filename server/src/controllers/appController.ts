import type { Request, Response } from 'express';
import { APP_KEY_FAMILY_NAME } from '../common/constant.ts';
import { findByKey } from '../db/APPMain.ts';
import logger from '../config/logger.ts';

export async function getFamilyName(req:Request, res: Response<string>) {
  const familyName = await findByKey(APP_KEY_FAMILY_NAME);
  if (familyName && familyName.value) {
    res.send(familyName.value);
  } else {
    logger.error('未设置家族姓氏');
    res.status(500).send('未设置家族姓氏');
  }
}
