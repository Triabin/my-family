import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import type User from './entity/User';

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.post('/', (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  res.send('ok');
});

app.post('/users', (req: Request, res: Response) => {
  const user: User = req.body;
  console.log(user);
  res.send(user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
