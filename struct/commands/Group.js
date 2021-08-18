const { Collection } = require('discord.js');

module.exports = class CommandGroup{
  constructor(){

    /**
		 * Default group
		 * @type {Collection}
		 */
    this.unspecified = new Collection();
  };

  /**
   * Get a specific group of commands
   * @param {string} command The string to query with
   * @returns {Collection<Command>} Collection of commands of the same group
   */
  get(name = 'unspecified'){

    if (!this[name]){
      this[name] = new Collection();
    } else {
      // Do nothing
    };

    return this[name];

  };
};
