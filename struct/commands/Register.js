module.exports = class CommandRegister{
  constructor(command){

    /**
		 * The name of the command to register
     * @type {string}
		 */
    this.name = command.name;

    /**
		 * searchable queries for this register
     * @type {string[]}
		 */
    this.names = [ command.name, ...command.aliases ];

    /**
		 * The name of the group of this register
     * @type {string}
		 */
    this.group = command.group || 'unspecified';

    /**
		 * The number of times this registry has been accessed to.
     * @type {number}
		 */
    this.used = 0;
  };
};
