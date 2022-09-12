const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const mongoose = require("mongoose");
const Lavamusic = require("./Lavamusic");

class MusicBot extends Client {
  constructor() {
    super({
      failIfNotExists: true,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
    });
    this.commands = new Collection();
    /**
     * @typedef {Object} ApplicationCommandInterface A base command interface with keys and their value literals.
     * @property {string} name Name for the command.
     * @property {string} description Description for the command.
     * @property {boolean} player Whether or not a player should exist for the command to execute.
     * @property {boolean} dj Whether or not the member should be a dj to execute the command.
     * @property {boolean} inVoiceChannel Whether or not the executor should be in a voice channel for the command to execute.
     * @property {boolean} sameVoiceChannel Whether or not the executor should be in the same voice channel as the client.
     */

    /**
     * @type {Collection<string, ApplicationCommandInterface>}
     */
    this.slashCommands = new Collection();
    this.config = require("../config.js");
    this.owner = this.config.ownerID;
    this.prefix = this.config.prefix;
    this.embedColor = this.config.embedColor;
    this.aliases = new Collection();
    this.commands = new Collection();
    this.logger = require("../utils/logger.js");
    this.emoji = require("../utils/emoji.json");
    if (!this.token) this.token = this.config.token;
    this.manager = new Lavamusic(this);

    this.rest.on("rateLimited", (info) => {
      this.logger.log(info, "log");
    });

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
    mongoose.connection.on("connected", () => {
      this.logger.log("[DB] DATABASE CONNECTED", "ready");
    });
    mongoose.connection.on("err", (err) => {
      console.log(`Mongoose connection error: \n ${err.stack}`, "error");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    ["commands", "slashCommand", "events"].forEach((handler) => {
      require(`../handlers/${handler}`)(this);
    });
  }
  connect() {
    return super.login(this.token);
  }
}

module.exports = MusicBot;
