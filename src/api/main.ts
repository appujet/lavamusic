import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from '../config';
import Logger from '../structures/Logger';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import session from 'express-session';
import passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.setGlobalPrefix("/api");
  app.use(
    session({
      secret: 'q7a1s4r41fs84s8ws7e7dnsd',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      store: new PrismaSessionStore(new PrismaClient(), {
          checkPeriod: 2 * 60 * 1000, //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        })
    }),
  );
  app.enableCors({
    origin: config.dashboard.website,
    credentials: true,
  });
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(config.dashboard.port);
  new Logger().success(`Api is running on port ${config.dashboard.port}`);
}

export { bootstrap };