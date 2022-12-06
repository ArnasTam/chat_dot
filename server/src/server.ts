import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { ConnectionOptions, createConnection } from 'typeorm';
import 'reflect-metadata';
import { logger } from './logger';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';
import { cron } from './cron';

const error = require('koa-json-error');

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: config.dbEntitiesPath,
  synchronize: true,
  ssl: true,
  extra: {
    encrypt: true,
  },
};

createConnection(connectionOptions)
  .then(async () => {
    const app = new Koa();

    app.use(error());

    app.use(async function (ctx, next) {
      await next();

      if (ctx.status >= 400) {
        ctx.status = ctx.status || 500;
        ctx.type = 'json';
        ctx.body = { error: ctx.body };
      }
    });

    app.use(bodyParser());

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'online.swagger.io', 'validator.swagger.io'],
        },
      }),
    );

    app.use(cors());

    app.use(logger(winston));

    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    cron.start();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error: string) => console.log('TypeORM connection error: ', error));
