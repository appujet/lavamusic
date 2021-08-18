module.exports = class GuildProfile{
  constructor(data){
    // *Goodbye Message refer to Leaving Member Announcer

    /**
    * The id of this profile identical to the guild ID
    * @type {string}
    */
    this.id = data._id;

    /**
    * The custom prefix for this guild.
    * @type {?string}
    */
    this.prefix = data.prefix || null;

    this.greeter = {

      welcome: {

        /**
        * Whether the welcome messages is enabled.
        * @type {Boolean}
        */
        isEnabled: data.greeter.welcome.isEnabled,

        /**
        * The channel ID for logging welcome messages (if enabled).
        * @type {?string<Snowflake>}
        */
        channel: data.greeter.welcome.channel,

        /**
        * The text version of the message for logging welcome messages.
        * @type {?string}
        */
        message: data.greeter.welcome.message,

        /**
        * The embedded version of the message for logging welcome messages.
        * @type {?MessageEmbed}
        */
        embed: data.greeter.welcome.embed,

        /**
        * Which type to use.
        * @type {string<default|text|embed>}
        */
        type: data.greeter.welcome.type
      },

      leaving: {

        /**
        * Whether the goodbye messages is enabled.
        * @type {Boolean}
        */
        isEnabled: data.greeter.leaving.isEnabled,

        /**
        * The channel ID for logging goodbye messages (if enabled).
        * @type {?string<Snowflake>}
        */
        channel: data.greeter.leaving.channel,

        /**
        * The text version of the message for logging goodbye messages.
        * @type {?string}
        */
        message: data.greeter.leaving.message,

        /**
        * The embedded version of the message for logging goodbye messages.
        * @type {?MessageEmbed}
        */
        embed: data.greeter.leaving.embed,

        /**
        * Which type to use.
        * @type {string<default|text|embed>}
        */
        type: data.greeter.leaving.type
      }
    };

    this.xp = {

      /**
      * Whether the xp system is active on the guild
      * @type {Boolean}
      */
      isActive: data.xp.isActive,

      /**
      * The channel IDs to blacklist from xp system.
      * @type {string[]}
      */
      exceptions: data.xp.exceptions
    };

    /**
    * Role IDs bound to specific bot function.
    * @type {Object} role Ids
    */
    this.roles = {

      /**
      * The role ID for the muterole
      * @type {?String}
      */
      muted: data.roles.muted
    };

    /**
    * Channel IDs bound to specific bot function.
    * @type {string{}}
    */
    this.featuredChannels = {
      suggest: data.channels.suggest
    };
  };

  /**
   * Retrieves the channel id of the suggest channel, if it exists
   * @private
   */
  get suggestChannel(){
    return this.featuredChannels.suggest
  };
};
