import pino from 'pino';
import { pinoHttp } from 'pino-http';

const logDir = process.env.LOG_DIR || '../logs';
const allLogLevel = process.env.LOG_LEVEL || 'info';
const logger = pino(pino.transport({
  targets: [
    // 全部日志输出到 all.log 文件
    { target: 'pino/file', options: { destination: `${logDir}/all.log`, mkdir: true }, level: allLogLevel },
    // 错误日志输出到 error.log 文件
    { target: 'pino/file', options: { destination: `${logDir}/error.log`, mkdir: true }, level: 'error' },
    // 全部日志输出到控制台并使用 pino-pretty 格式化
    { target: 'pino-pretty', options: { colorize: true, translateTime: true }, level: allLogLevel }
  ]
}));
// 使用 pino-http 作为 HTTP 请求日志中间件
const pinoHttpMiddlewareCfg = pinoHttp({
  logger,
});

export default logger;
export { pinoHttpMiddlewareCfg };
