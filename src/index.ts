import Lavamusic from "./structures/Lavamusic.js";
import { ClientOptions, GatewayIntentBits } from "discord.js";
import { Config } from "./config.js";
const { GuildMembers, MessageContent, GuildVoiceStates, GuildMessages, Guilds, GuildMessageTyping } = GatewayIntentBits;
const clientOptions: ClientOptions = {
    intents: [Guilds, GuildMessages, MessageContent, GuildVoiceStates, GuildMembers, GuildMessageTyping],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
}

const client = new Lavamusic(clientOptions);


client.start(Config().TOKEN);