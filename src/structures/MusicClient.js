const { Client, Intents, Collection, MessageEmbed, MessageButton, MessageSelectMenu } = require("discord.js");
const { Manager } = require("erela.js");
const { readdirSync } = require("fs");
const deezer = require("erela.js-deezer");
const Spotify = require("erela.js-spotify");
const apple = require("erela.js-apple");
const facebook = require("erela.js-facebook");
const mongoose = require('mongoose');
require("./PlayerBase"); 
require("../utils/lavamusic");
class MusicBot extends Client {
	 constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES, 
                Intents.FLAGS.GUILD_MEMBERS, 
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });
		 this.commands = new Collection();
     this.slashCommands = new Collection();
     this.config = require("../config.js");
     this.owner = this.config.ownerID;
     this.prefix = this.config.prefix;
     this.embedColor = this.config.embedColor;
     this.aliases = new Collection();
     this.commands = new Collection();
     this.logger = require("../utils/logger.js");
     this.emoji = require("../utils/emoji.json");
     if(!this.token) this.token = this.config.token;
   /**
    *  Mongose for data base
    */
		 const dbOptions = {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
      };
        mongoose.connect(this.config.mongourl, dbOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
         this.logger.log('[DB] DATABASE CONNECTED', "ready");
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
    this.on("disconnect", () => console.log("Bot is disconnecting..."))
    this.on("reconnecting", () => console.log("Bot reconnecting..."))
    this.on('warn', error => console.log(error));
    this.on('error', error => console.log(error));
    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error))
    const client = this;
    this.manager = new Manager({
      autoPlay: true,
      nodes: this.config.nodes,
      plugins: [
        new deezer(),
        new Spotify({
          clientID: this.config.SpotifyID,
          clientSecret: this.config.SpotifySecret
        }),
        new apple(),
        new facebook(),
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
		  
/**
 * Client Events
 */
   readdirSync("./src/events/Client/").forEach(file => {
    const event = require(`../events/Client/${file}`);
    this.on(event.name, (...args) => event.run(this, ...args));
});
/**
 * Erela Manager Events
 */ 
  readdirSync("./src/events/Lavalink/").forEach(file => {
    const event = require(`../events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    this.logger.log(`Loading Events Lavalink ${eventName}`, "event");
    this.manager.on(eventName, event.bind(null, this));
});
/**
 * Import all commands
 */
  readdirSync("./src/commands/").forEach(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${dir}/${file}`);
        this.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
        this.commands.set(command.name, command);
    }
})
/**
 * SlashCommands 
 */
  const data = [];
       
  readdirSync("./src/slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));
    
        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`);

            if(!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if(!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            this.slashCommands.set(slashCommand.name, slashCommand);
            this.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`, "cmd");
            data.push(slashCommand);
        }
     });
	  this.on("ready", async () => {
        await this.application.commands.set(data).then(() => this.logger.log(`Client Application (/) Registered.`, "cmd")).catch((e) => console.log(e));
    });
	 }
		 connect() {
        return super.login(this.token);
    };
};
module.exports = MusicBot;
