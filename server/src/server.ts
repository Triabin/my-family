import express, {type Express, type NextFunction, type Request, type Response} from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './config/logger.ts';
import { register, login, findUser } from './controllers/userController.ts';
import { getFamilyName } from './controllers/appController.ts';
import { pinoHttpMiddleware, authorizationMiddleware } from './common/customMiddlewares.ts';

// 在 ES 模块中获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(pinoHttpMiddleware);
app.use(authorizationMiddleware);

app.get('/api/family-name', getFamilyName);
app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/find-user/:id', findUser);
// 所有其他路由返回 index.html（SPA 路由）
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
