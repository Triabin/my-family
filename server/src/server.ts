import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import type User from '@core/db/entity/User.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import logger, { pinoHttpMiddleware } from './config/logger.ts';

// 在 ES 模块中获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(pinoHttpMiddleware);

app.post('/userList', (req: Request, res: Response) => {
  const user: User = req.body;
  logger.info(user);
  res.send(user);
});

app.get('/family-name', (req: Request, res: Response) => {
  const familyName: string | undefined = process.env.FAMILY_NAME;
  if (familyName) {
    res.send(familyName);
  } else {
    res.status(500).send('未设置家族姓氏');
  }
});

// 所有其他路由返回 index.html（SPA 路由）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
