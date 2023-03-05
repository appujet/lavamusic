import { BotPlugin } from '../types.js';
import { Lavamusic } from '../../structures/index.js';


const aintiCrash: BotPlugin = {
    name: 'AintiCrash Plugin',
    version: '1.0.0',
    author: 'Blacky',
    initialize: (client: Lavamusic) => {
        process.on('unhandledRejection', (reason, promise) => {
            client.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        process.on('uncaughtException', (err) => {
            client.logger.error('Uncaught Exception thrown:', err);
        });
    }
}

export default aintiCrash;