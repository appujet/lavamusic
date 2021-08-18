const { Collection } = require('discord.js');
const { basename, join } = require('path');

const CommandGroup = require(`./Group`);
const CommandRegister = require(`./Register`);
const CooldownManager = require(`./Cooldown`);
const Command = require(`./Base`);

const consoleUtil = require(`${process.cwd()}/util/console`);
const _handle = require(`${process.cwd()}/util/handle`);

module.exports = class CommandManager{
  constructor(client){

    /**
     * The client that instantiated this Manager
     * @name CommandManager#client
     * @type {AlinaClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
		 * The name of the groups this manager handles
		 * @type {CommandGroups[]}
     * @private
     */
    this._groups = [];

    /**
     * The parent folder of this manager from src
     * @type {?ParentFolder}
     */
    this.parent = null;

    /**
     * The groups this Manager currently holds
     * @type {CommandGroup}
     */
    this.groups = new CommandGroup();

    /**
     * The Command Registry
     * @type {Collection<CommandRegister>}
     */
    this.registers = new Collection();

    /**
     * The Collection of the command's cooldown manager
     * @type {Collection<Cooldown>}
     */
    this.cooldowns = new Collection();

  };

  /**
  * Adds a new command to the handler
  * @param {Command} command The command to add
  * @param {object} options Additional options
  * @returns {CommandManager} This instance
  */
  add(command, options = {}){

    if (!(command instanceof Command)){
      command = new Command(this.client, command);
    };

    const log = Boolean(options.log);
    const bypass = Boolean(options.bypass);

    function check(){
      if (!bypass){ process.exit(); } else { return true; };
    };

    if (typeof command.name !== 'string'){
      if (log) { consoleUtil.error(`NO_NAME_FOUND: ${basename(command.filename)} has no command name.`); };
      if (check()) { return; }
    };

    this.groups.get(command.group).set(command.name, command);
    this.registers.set(command.name, new CommandRegister(command));

    if (command.cooldown.time){
      this.cooldowns.set(command.name, new CooldownManager(command));
    } else {
      // Do nothing..
    };
    return this;

  };

  /**
  * Reloads a command to the handler
  * @param {query<CommandName|CommandAlias>} query Query of the command to reload
  * @returns {reloadStatus} status of the command to load
  */
  reload(query){

    const register = this.registers.get(query) || this.registers.find( c => c.names.includes(query))

    if (!register) return { status: 'FAILED', err: { stack: `Error: Couldn't find a command with name/alias "${query}".`}}

    let command = this.groups.get(register.group).get(register.name);

    try {
      delete require.cache[
        require.resolve(
          join(process.cwd(), this.parent, command.group, command.name)
        )
      ];
    } catch (err){
      return { status: 'FAILED', err }
    };

    const newCommand = new Command(this.client, require(join(process.cwd(), this.parent, command.group, command.name)));

    this.groups.get(newCommand.group).set(newCommand.name, newCommand);

    this.registers.set(newCommand.name, new CommandRegister(newCommand));

    if (!newCommand.cooldown.time) {
      this.cooldowns.delete(newCommand.name)
    } else {
      // Do nothing..
    };

    return { status: 'OK', info: newCommand };

  };

  /**
  * Gets a command
  * @param {query<CommandName|CommandAlias>}  query !uery of the Command to get
  * @returns {?Command} The loaded command object
  */
  get(query){
    const register = this.registers.get(query) || this.registers.find( c => c.names.includes(query))

    if (!register) return undefined

    register.used++

    return this.groups.get(register.group).get(register.name)
  };

  /**
  * Function for handling command
  * @param {Message} message The message object to execute this handler with
  * @returns {Function<CommandHandler>} The function to execute
  */
  handle(message){
    return _handle(this, message);
  };

  /**
   * The number of commands this manager currently holds
   * @type {number}
   * @readonly
   */
  get size(){
    let size = 0
    for ( const group of Object.keys(this.groups) ) {
      size += this.groups.get(group).size
    }
    return size
  };

};
