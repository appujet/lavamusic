import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from '../config';
import Logger from '../structures/Logger';
import session from 'express-session';
import passport from 'passport';
import connectMongo from 'connect-mongodb-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  const MongoDBStore = connectMongo(session);
  const store = new MongoDBStore({
    uri: config.database,
    collection: 'sessions',
    databaseName: 'connect_mongodb_session',
    
  });
  app.setGlobalPrefix("api");
  app.use(
    session({
      secret: 'q7a1s4r41fs84s8ws7e7dnsd',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24,
      },
      store: store,
    }),
  );
  app.enableCors({
    origin: config.dashboard.website + ":" + config.dashboard.port,
    credentials: true,
  }); 
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(config.dashboard.port);
  new Logger().success(`Api is running on port ${config.dashboard.website}:${config.dashboard.port}`);
}

export { bootstrap };
