const { Collection } = require('discord.js');

module.exports = class CooldownManager{
  constructor(command){

    /**
		 * The name of the command this manager is used for
		 * @type {string}
		 */
    this.name = command.name

    /**
		 * The collection of userID this command has currently
		 * @type {Collection}
		 */
    this.users = new Collection()
  };
};
