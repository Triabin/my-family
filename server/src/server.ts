import app from './app.ts';
import logger from './config/logger.ts';

const port: number = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  logger.info(`Server running on port http://localhost:${port}`);
});
