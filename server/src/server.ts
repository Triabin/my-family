import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logger, { pinoHttpMiddleware } from './config/logger.ts';
import { createUser, findUser } from './controllers/userController.ts';
import { getFamilyName } from './controllers/appController.ts';

// 在 ES 模块中获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// 日志中间件
app.use((req: Request, res: Response, next) => {
  if (req.url.startsWith('/api')) {
    pinoHttpMiddleware(req, res, next);
  } else {
    next();
  }
});

app.get('/api/family-name', getFamilyName);
app.post('/api/create-user', createUser);
app.get('/api/find-user/:id', findUser);

// 所有其他路由返回 index.html（SPA 路由）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
