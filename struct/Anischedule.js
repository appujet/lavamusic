
require('moment-duration-format');
const { duration } = require('moment');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

const schedule = require('require-text')(`${process.cwd()}/assets/graphql/Schedule.graphql`, require);
const watchlist = require(`${process.cwd()}/models/GuildWatchlist`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const anilist = require(`${process.cwd()}/util/anilist`);
const constants = require(`${process.cwd()}/util/constants`);

module.exports = class Anischedule{
  constructor(client){

    /**
     * The client that instantiated this Scheduler
     * @name Anischedule#client
     * @type {AlinaClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
     * Whether the scheduler is enabled
     * @type {boolean}
     */
    this.enabled = this.client.config.features.includes('ANISCHEDULE');

    /**
     * the queuedNotifications for the current running instance of {@link} Anischedule#makeAnnouncement
     * @type {array}
     */
    this.queuedNotifications = [];

    this.info = {
      /**
       * Media Formats for the fetched data
       * @type {array}
       */
      mediaFormat: constants.mediaFormat,
      months: constants.months,
      defaultgenres: constants.mediaGenres,
      langflags: constants.langflags
    };
  };

  /**
   * Fetch data on the Anilist API using the query and variable.
   * @param {string} query The [Graphiql] string to query with
   * @param {object} variables The variables to fetch with
   * @returns {Promise<data>}
   */
  fetch(query, variables){
    return anilist.fetch(query, variables);
  };

  /**
   * Fetch all media id from the guild watchlists.
   * @returns {Promise<array>} array of unique ids from the watchlist
   */
  getAllWatched(){
    return new Promise(async resolve => {
      const list = await watchlist.find({}).catch(() => []);
      return resolve([...new Set(list.flatMap(guild => guild.data))]);
    });
  };

  /**
   * Embedify a media object.
   * @param {data} entry the media object to embedify
   * @param {Date} date The airing date of the media.
   * @returns {MessageEmbed}
   */
  getAnnouncementEmbed(entry, date){

    const sites = [
      'Amazon', 'Animelab', 'AnimeLab',
      'Crunchyroll', 'Funimation',
      'Hidive', 'Hulu', 'Netflix', 'Viz'
    ];

    const watch = entry.media.externalLinks.filter(x => sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    const visit = entry.media.externalLinks.filter(x => !sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    return new MessageEmbed()
    .setColor(entry.media.coverImage.color || 'GREY')
    .setThumbnail(entry.media.coverImage.large)
    .setAuthor('ALi Anischedule')
    .setTimestamp(date)
    .setDescription([
      `Episode **${entry.episode}** of **[${entry.media.title.romaji}](${entry.media.siteUrl})**`,
      `${entry.media.episodes === entry.episode ? ' **(Final Episode)** ' : ' '}`,
      `has just aired.${watch ? `\n\nWatch: ${watch}` : ''}${visit ? `\n\nVisit: ${visit}` : ''}`,
      `\n\nIt may take some time to appear on the above service(s).`
    ].join(''))
    .setFooter([
      `${entry.media.format ? `Format: ${constants.mediaFormat[entry.media.format] || 'Unknown'}`:''}`,
      `${entry.media.duration ? `Duration: ${ duration(entry.media.duration * 60, 'seconds') .format('H [hr] m [minute]') }  `:''}`,
      `${!!entry.media.studios.edges.length ? `Studio: ${ entry.media.studios.edges[0].node.name }` : ''}`
    ].filter(Boolean).join('  •  '));
  };

  /**
   * Get the Date instance of the next (number of) day(s)
   * @param {number} days Number of days to fetch timestamp with
   * @returns {Date}
   */
  getFromNextDays(days = 1){
    return new Date(new Date().getTime() + (864e5 * days));
  };

  /**
   * Handle the scheduler
   * Fetch the data and append timeout functions to data to execute
   * @param {*} nextDay the timestamp of the date to grab data from
   * @param {*} page The current page returned from data via graphiql Pagination
   * @returns {Promise<void>}
   */
  async handleSchedules(nextDay, page){

    const watched = await this.getAllWatched();

    if (!watched || !watched.length){
      if (this.client.config.features.includes('ANISCHEDULE')){
        consoleUtil.error(`ANISCHEDULE: Missing Data from Database.\nNo lists were found on the database. Please ignore this message if this is the first time setting the bot.`)
      };
      return;
    };

    const res = await this.fetch(schedule, { page, watched, nextDay });

    if (res.errors){
      return consoleUtil.error(`ANISCHEDULE: FetchError\n${res.errors.map(err => err.message).join('\n')}`);
    };

    for (const e of res.data.Page.airingSchedules){
      const date = new Date(e.airingAt * 1000)
      if (this.queuedNotifications.includes(e.id)) continue;

      consoleUtil.success(`Tracking Announcement for Episode \x1b[36m${
        e.episode
      }\x1b[0m of \x1b[36m${
        e.media.title.romaji || e.media.title.userPreferred
      }\x1b[0m in \x1b[36m${
        duration(e.timeUntilAiring, 'seconds').format('H [hours and] m [minutes]')
      }\x1b[0m`, `[ANISCHEDULE]`);

      this.queuedNotifications.push(e.id);

      setTimeout(() => this.makeAnnouncement(e, date), e.timeUntilAiring * 1000);
    };

    if (res.data.Page.pageInfo.hasNextPage){
      this.handleSchedules(nextDay, res.data.Page.pageInfo.currentPage + 1);
    };
  };

  /**
   * Initialize the scheduler
   * @returns {Interval}
   */
  async init(){
    if (!this.enabled){
      return;
    } else if (!this.client.database.connected){
      consoleUtil.error('Unable to start Anischedule. Reason: Database not found. Retrying...', 'db');
      await new Promise(resolve => this.client.database.db.connection.once('connected', resolve(null)));
    } else {
      // Do nothing
    };

    return this.client.loop(() => {
      return this.handleSchedules(Math.round(this.getFromNextDays().getTime() / 1000))
    }, 24 * 60 * 60 * 1000);
  };

  /**
   * Send the announcement to a valid text channel
   * @returns {Promise<void>}
   */
  async makeAnnouncement(entry, date){

    this.queuedNotifications = this.queuedNotifications.filter(e => e !== entry.id);
    const embed = this.getAnnouncementEmbed(entry, date);

    const list = await watchlist.find({}).catch(()=> null);

    if (!list){
      if (this.client.config.features.includes('ANISCHEDULE')){
        consoleUtil.error(`ANISCHEDULE: Missing Data from Database.\nNo lists were found on the database. Please ignore this message if this is the first time setting the bot.`)
      };
      return;
    };

    for (const g of list){
      if (!g.data.includes(entry.media.id)){
        continue;
      };

      const channel = this.client.channels.cache.get(g.channelID);

      if (!channel || !channel.permissionsFor(channel.guild.me).has(['SEND_MESSAGES','EMBED_LINKS'])){
        consoleUtil.error(`Announcement for ${
          entry.media.title.romaji || entry.media.title.userPreferred
        } has \x1b[31mfailed\x1b[0m in ${
          channel.guild.name || g.channelID
        } because ${
          channel.guild ? `of \x1b[31mmissing\x1b[0m 'SEND_MESSAGES' and/or 'EMBED_LINKS' permissions.`
          : `such channel \x1b[31mdoes not exist\x1b[0m.`
        }`);
        continue;
      };

      await channel.send(embed)
      .then((msg) => {
        consoleUtil.success(`Announcing episode \x1b[36m${
          entry.media.title.romaji || entry.media.title.userPreferred
        }\x1b[0m to \x1b[36m${
          channel.guild.name
        }\x1b[0m @ \x1b[36m${
          channel.id
        }\x1b[0m`);
      }).catch(err => {
        consoleUtil.error(`Announcement for \x1b[36m${
          entry.media.title.romaji || entry.media.title.userPreferred
        }\x1b[0m : \x1b[31mFailed:\x1b[0m${err.name}`);
      });
    };

    return;
  };
};
