import Lavamusic from "./structures/Lavamusic.js";
import { ClientOptions } from "discord.js";
import { Config } from "./config.js";

const clientOptions: ClientOptions = {
    intents: 32767,
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: false
    }
}

const client = new Lavamusic(clientOptions);

async function start() {
    await client.start(Config().TOKEN);
}

start();
