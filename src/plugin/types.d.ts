
export interface BotPlugin {
    name: string;
    version: string;
    author: string;
    description?: string;
    initialize: (client: Lavamusic) => void;
    shutdown?: (client: Lavamusic) => void;
}
