'use strict';

const { Client, version} = require('discord.js');
const { performance } = require('perf_hooks');
const { readdirSync } = require('fs');
const { join } = require('path');

const Anischedule = require(`./Anischedule`);
const CommandManager = require(`./commands/Manager`);
const GuildProfilesManager = require(`./guilds/ProfileManager`);
const Collections = require(`./Collections`);
const Mongoose = require(`./Mongoose`);

const PingManager = require(`./PingManager`);
const ImageManager = require(`./Images`);

const consoleUtil = require(`../util/console`);
const processEvents = require(`../util/processEvents`);

/**
 * Optimized hub for interacting with the Discord API
 * @extends {Client}
 */

module.exports = class AlinaClient extends Client{
  /**
   * @param {ClientSettings} [settings] for this client, including the ClientOptions [options] for the client
   */
  constructor(settings = {}){
    super(settings.client);

    // Initialize bot, log on terminal when instantiated.
    console.log(`Initializing the client. Please wait...`);

    /**
     * The default prefix this bot instance will be using.
     * @type {?string}
     */
    if (typeof settings.prefix !== 'string'){
      settings.prefix = 'a!';
    };

    if (!this.token && 'TOKEN' in process.env){
      /**
      * Authorization token for the logged in bot.
      * If present, this defaults to `process.env.TOKEN` or `process.env.DISCORD_TOKEN` when instantiated
      * <warn> This should be kept private at all times </warn>
      * @type {?string}
      */
      this.token = process.env.TOKEN;
    };

    /**
     * Time took by the bot to start from loading files to the first `READY` state
     * @type {?Number}
     */
    this.bootTime = null;

    /**
     * The Command manager of the client
     * @type {CommandManager}
     */
    this.commands = new CommandManager(this);

    /**
     * The Collections of the client
     * @type {Collections}
     */
    this.collections = new Collections();

    /**
     * The Guild Profiles manager of the client
     * @type {GuildProfilesManager}
     */
    this.guildProfiles = new GuildProfilesManager(this);


    /**
     * All of the images used by the bot on image based commands.
     * @type {ImageManager}
     */
    this.images = new ImageManager();

    /**
     * The external database connected to this bot (null when disabled);
     * @type {?Mongoose}
    */
    this.database = null;

    if (settings.database.enable === true){
      this.database = new Mongoose(this, settings.database);
    } else {
      // Do nothing..
    };

    /**
     * Counter for messages received and sent by the bot
     * @type {?MessageCount}
     */
    this.messages = { received: 0, sent: 0 };
    
     
    /**
     * Pre-defined bot conifigurations.
     * @type {ClientConfig}
     */
    this.config = {
      prefix: settings.prefix || 'a!',
      features: [],
      owners: [],
      foot: settings.footer,
      color: settings.color,
      channels: { debug: null, uploads: null, logs: null },
      websites: settings.websites
    };
   
    /**
     * Channel ID used by the bot to log errors when enabled.
     * @type {?Snowflake}
     */
    if (typeof settings.channels.debug === 'string'){
      this.config.channels.debug = settings.channels.debug;
    } else {
      // Do nothing...
    };

    /**
     * Channel ID used by the bot to send vote messages
     * @type {?Snowflake}
     */
    if (typeof settings.channels.votes === 'string'){
      this.config.channels.votes = settings.channels.votes;
    } else {
      // Do nothing...
    };

    /**
     * Channel ID used by the bot to upload files for some commands that necessitates uploads.
     * @type {?Snowflake}
     */
    if (typeof settings.channels.uploads === 'string'){
      this.config.channels.uploads = settings.channels.uploads;
    } else {
      // Do nothing...
    };

    if (typeof settings.channels.logs === 'string'){
      this.config.channels.logs = settings.channels.logs;
    } else {
      // Do nothing...
    };

    /**
     * Array of {@link User} IDs that will be considered by the bot it's owner.
     * Will be used by {@link CommandHandler} when attempting to read ownerOnly commands.
     * @type {?string[]}
     */
    if (Array.isArray(settings.owners)){
      if (settings.owners.length){
        this.config.owners = settings.owners;
      } else {
        // Do nothing
      };
    } else {
      // Do nothing
    };

    /**
     * Array of features allowed for this bot instance.
     * @type {?array}
     */
    if (Array.isArray(settings.allowedFeatures)){
      if (settings.allowedFeatures.length){
        this.config.features = settings.allowedFeatures;
      } else {
        // Do nothing
      };
    } else {
      // Do nothing
    };

    /**
     * Anime Scheduler for the bot.
     * @type {?Anischedule}
     */
    this.anischedule = new Anischedule(this);

    /**
     * The manager for pings the bot has been monitoring to.
     * @type {PingManager}
     */
    this.pings = new PingManager(this, settings.monitorPings);

    /**
     * Logs for this bot.
     * @type {array}
     */
    this.logs = [];

    // Execute these internal functions once the bot is ready!!
    this.once('ready', () => {
      this.bootTime = Math.round(performance.now());
      this.guildProfiles.load();
      return;
    });

    // Execute these internal functions once the database establishes connection!!
    this.database.db.connection.once('connected', () => {
      this.anischedule.init();
      return;
    });

    // increment message count whenever this client emits the message event
    this.on('message', message => {
      if (message.author.id === this.user.id){
        return this.messages.sent++;
      } else {
        return this.messages.received++;
      };
    });
  };

  /**
   * Bulk add collections to the collection manager
   * @param {...CollectionName} string The name of collections to add
   * @returns {AlinaClient}
   */
  defineCollections(collection = []){
    if (!Array.isArray(collection)){
      throw new TypeError(`Client#defineCollections parameter expected type Array, received ${typeof collection}`);
    };

    for (const col of collection){
      this.collections.add(col);
    };

    return this;
  };

  /**
   * Attach a listener for process events.
   * @param {...string} event The process event name to listen to
   * @param {ProcessEventConfig} config The configuration for the process events.
   * @returns {void}
   */
  listentoProcessEvents(events = [], config = {}){
    if (!Array.isArray(events)){
      return;
    };

    if (typeof config !== 'object'){
      config = {};
    };

    for (const event of events){
      process.on(event, (...args) => {
        if (config.ignore && typeof config.ignore === 'boolean'){
          return;
        } else {
          return processEvents(event, args, this);
        };
      });
    };
  };

  /**
   * Load command files to this client instance.
   * @param {LoadCommandSettings} settings The settings for loading the commands
   * @returns {void}
   */
  loadCommands(settings = {}){

    let log = true;
    const bypass = Boolean(settings.bypass);

    if (typeof settings.log === 'boolean'){
      log = settings.log;
    };

    function check(){
      if (!bypass){ process.exit(); } else { return true; };
    };

    if (typeof settings.parent !== 'string'){
      if (log) consoleUtil.warn('Command parent folder not set, reverting to default directory \'commands\'', '[BOT WARN]');
      settings.parent = 'commands';
    };

    this.commands.parent = settings.parent;

    if (!settings.paths.length){
      settings['paths'] = ['']
    };

    if (!Array.isArray(settings.paths)){
      if (log) { consoleUtil.error(`INVALID_COMMAND_PATH: No Paths to load commands from.`, 'path'); };
      if (check()) return;
    };

    if (!(this.commands instanceof CommandManager)){
      this.commands = new CommandManager({ groups: settings.groups });
    };

    for (let dir of settings.paths){
      if (Array.isArray(dir)){
        dir = join(...dir);
      };

      let files = null;

      try {
        files = readdirSync(join(process.cwd(), settings.parent, dir))
        .filter(f => f.split('.').pop() === 'js');
      } catch {
        if (log){
          consoleUtil.error(`DIR_NOT_FOUND: Cannot resolve path '${join(process.cwd(), settings.parent, dir)}'`, 'dir');
        };
        if (check()) continue;
      };

      for (const file of files){
        this.commands.add(require(join(process.cwd(), settings.parent, dir, file)), { log, bypass });
      };
    };

    if (log){
      consoleUtil.success(`Loaded ${this.commands.size} commands!`)
    };
  };

  /**
   * Load event files to this client instance
   * @param {LoadEventSettings} settings The settings for loading the events
   * @returns {void}
   */
  loadEvents(settings = {}){

    const log = settings.log && typeof settings.log === 'boolean';
    const bypass = settings.bypass && typeof settings.bypass === 'boolean';

    function check(){
      if (!bypass){ process.exit(); } else { return true; };
    };

    if (typeof settings.parent !== 'string'){
      if (log){
         consoleUtil.warn('Events parent folder not set, reverting to default directory \'events\'');
      } else {
        // Do nothing...
      };
      settings.parent = 'events';
    };

    let files = null;

    try {
      files = readdirSync(join(process.cwd(), settings.parent)).filter(f => f.split('.').pop() === 'js');
    } catch {
      if (log) {
        consoleUtil.error(`DIR_NOT_FOUND: Cannot resolve path '${join(process.cwd(),settings.parent)}'`, 'dir');
      } else {
        // Do nothing...
      };
      if (check()) { return; };
    };

    for (const event of files){
      this.on(event.split('.')[0], require(join(process.cwd(), settings.parent, event)).bind(null, this));
    };

    if (log){
      consoleUtil.success(`Loaded ${files.length} event files!`)
    };
  };

  /**
  * Executes a function once and then loops it
  * @param {function} function The function to execute
  * @param {number} delay The delay between each execution
  * @param {params} parameter Additional parameters for the Interval function
  * @returns {Timeout} timeout returns a Timeout object
  */
  loop(fn, delay, ...param){
    fn();
    return setInterval(fn, delay, ...param);
  };

  /**
  * get logs
  * @returns {string<logs>} logged messages for this bot
  */
  getlogs(){
    return this.logs.join('\n') || 'Logs are currently Empty!'
  };

  /**
   * The prefix this client instance has been using
   * @type {ClientPrefix}
   * @readonly
   */
  get prefix(){
    return this.config.prefix;
  };

  /**
   * The features this client instance has access to
   * @type {ClientFeatures[]}
   * @readonly
   */
  get features(){
    return this.config.features;
  };

  /**
   * The owners of this bot
   * @type {ClientOwners[]}
   * @readonly
   */
  get owners(){
    return this.config.owners;
  };

  /**
   * The version of this app and the library its been using
   * @type {Version{}}
   * @readonly
   */
  get version(){
    return {
      library: version,
      client: require(`${process.cwd()}/package.json`).version
    };
  };
};
