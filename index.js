const { Client, Collection, Intents } = require("discord.js");
const { readdirSync } = require("fs");
const env = require('dotenv');
const client = new Client({
   shards: "auto",
   intents: [Intents.FLAGS.GUILDS, Intents.
FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    allowedMentions: {
        parse: ["everyone", "roles", "users"],
        repliedUser: true
    },
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]

});
module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");
client.owner = process.env.OWNERID || client.config.ownerID;
client.prefix = process.env.PREFIX || client.config.prefix;
client.embedColor = client.config.embedColor;
client.aliases = new Collection();
client.commands = new Collection();
client.categories = readdirSync("./commands/");
client.logger = require("./utils/logger.js");
client.emoji = require("./utils/emoji.json");

require("./handler/Client")(client);


client.login(process.env.TOKEN || client.config.token);


