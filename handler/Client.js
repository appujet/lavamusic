const { Client } = require("discord.js");const chalk = require("chalk");
const array = [];
const mongoose = require('mongoose');
const { Database } = require("quickmongo");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const FaceBook = require("erela.js-facebook");
const { readdirSync } = require("fs");




/**
 * @param {Client} client
 */
module.exports = async (client) => {

    client.manager = new Manager({
        nodes: client.config.nodes,
        send: (id, payload) => {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
        autoPlay: true,
        plugins: [new Spotify({
            clientID: client.config.SpotifyID,
            clientSecret: client.config.SpotifySecret,
        }),
                new Deezer(),
                new FaceBook()
            ],
       });
    
    client.on("raw", (d) => client.manager.updateVoiceState(d));
    /**
     * Mongodb connection
     */
    
    const dbOptions = {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
      };
        mongoose.connect(client.config.mongourl, dbOptions);
        mongoose.Promise = global.Promise;
          mongoose.connection.on('connected', () => {
              client.logger.log('[DB] DATABASE CONNECTED', "ready");
              });
          mongoose.connection.on('err', (err) => {
                  console.log(`Mongoose connection error: \n ${err.stack}`, "error");
              });
          mongoose.connection.on('disconnected', () => {
                  console.log('Mongoose disconnected');
              });
        
    /**
     * Error Handler
     */
    client.on("disconnect", () => console.log("Bot is disconnecting..."))
    client.on("reconnecting", () => console.log("Bot reconnecting..."))
    client.on('warn', error => console.log(error));
    client.on('error', error => console.log(error));
    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));
    
 /**
 * Client Events
 */
readdirSync("./events/Client/").forEach(file => {
    const event = require(`../events/Client/${file}`);
    let eventName = file.split(".")[0];
    client.logger.log(`Loading Events Client ${eventName}`, "event");
    client.on(eventName, event.bind(null, client));
});

/**
 * Erela Manager Events
 */
readdirSync("./events/Lavalink/").forEach(file => {
    const event = require(`../events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    client.logger.log(`Loading Events Lavalink ${eventName}`, "event");
    client.manager.on(eventName, event.bind(null, client));
});



/**
 * Import all commands
 */
readdirSync("./commands/").forEach(dir => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${dir}/${file}`);
        client.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
        client.commands.set(command.name, command);
    }
})

/// slashCommands
   const data = [];
       
readdirSync("./slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
    
        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);

            if(!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if(!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);
            client.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`, "cmd");
            data.push(slashCommand);
        }
    });

    client.on("ready", async () => {
          await client.application.commands.set(data).then(() => client.logger.log(`Client SlashCommand (/) Registered.`, "ready")).catch((e) => console.log(e));
    });
  

}
