import express, { type Express } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { pinoHttpMiddleware, authorizationMiddleware } from './common/customMiddlewares.ts';
import router from './router/index.ts';
import { isInitialized } from './services/appMainService.ts';

// 在 ES 模块中获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(pinoHttpMiddleware);
app.use(authorizationMiddleware);
app.use('/api', router);

// 所有其他路由返回 index.html（SPA 路由）
app.get('/', async (_, res) => {
  const isInit = await isInitialized();
  console.log('isInit', isInit);
  if (!isInit) {
    return res.redirect('/install');
  }
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

export default app;
