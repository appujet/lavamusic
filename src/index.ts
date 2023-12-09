import { ShardingManager } from 'discord.js';
import config from './config.js';

const manager = new ShardingManager('./dist/LavaClient.js', {
    token: config.token,
});

manager.spawn();

// That's it. No need for fancy logging, error handling, or file reading. 
// Just let the sharding manager do its magic and hope for the best.
// You're welcome.
