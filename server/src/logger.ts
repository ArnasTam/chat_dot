import { Context } from 'koa';
import { config } from './config';
import { format, transports } from 'winston';
import * as path from 'path';

const logger = (winstonInstance: any): any => {
  winstonInstance.configure({
    level: config.debugLogging ? 'debug' : 'info',
    transports: [
      new transports.File({
        filename: path.resolve(__dirname, '../error.log'),
        level: 'error',
      }),
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  });

  return async (ctx: Context, next: () => Promise<any>): Promise<void> => {
    const start = new Date().getTime();
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
    const ms = new Date().getTime() - start;

    let logLevel: string;
    if (ctx.status >= 500) {
      logLevel = 'error';
    } else if (ctx.status >= 400) {
      logLevel = 'warn';
    } else {
      logLevel = 'info';
    }

    const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    winstonInstance.log(logLevel, msg);
  };
};

export { logger};