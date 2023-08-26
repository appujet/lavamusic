import { BotPlugin } from '../index';
import { Lavamusic } from '../../structures/index';

const antiCrash: BotPlugin = {
  name: 'AntiCrash Plugin',
  version: '1.0.0',
  author: 'Blacky',
  initialize: (client: Lavamusic) => {
    process.on('unhandledRejection', (reason, promise) => {
      client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (err) => {
      client.logger.error('Uncaught Exception thrown:', err);
    });
  },
};

export default antiCrash;
