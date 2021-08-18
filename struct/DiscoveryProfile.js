const { User, GuildMember } = require('discord.js');
const array = require(`${process.cwd()}/util/array.js`);
const anilist = require(`${process.cwd()}/util/anilist.js`);
const constants = require(`${process.cwd()}/util/constants.js`);
const db = {
  anime: require(`${process.cwd()}/assets/json/anime.json`),
  manga: require(`${process.cwd()}/assets/json/manga.json`)
};


module.exports = class DiscoveryProfile {
  constructor(user){

    if (user instanceof GuildMember || user instanceof User){
      /**
       * The id of this profile identical to the user ID
       * @type {string}
       */
      this.id = user.id;
    } else {
      throw new Error('Discovery Profile: constructor requires instance of GuildMember or User.')
    };

    /**
    * The time the data was last updated.
    * @type {?Date}
    */
    this.updated = null;

    /**
     * Handler for the data this profile will be using
     * @type {ObjectData}
     */
    for (const type of ['anime','manga']){
      this[type] = {
        genres: [],
        data: [],
        viewcount: 0,
      };
    };
  };

  /**
   * fetch data from Anilist API
   * @param {[mediaID]} array Array of media ids
   * @returns {Promise<fetchedData>}
   * @private
   */
  _fetch(ids){
    return anilist.fetch('query ($ids: [Int]) { Page{ media(id_in: $ids){ siteUrl id idMal type isAdult format startDate { year month day } episodes duration chapters volumes genres studios(isMain:true){ nodes{ name siteUrl } } coverImage{ large color } description title { romaji english native userPreferred } } } }', { ids });
  };

  /**
   * Populate this Profile instance with data
   * @returns {Promise<Data>}
   */
  async fetch(){
    const errors = [];
    const ids = [];

    if (this.hasData){
      return Promise.resolve({ data: { anime: this.anime.data, manga: this.manga.data }, errors });
    };
    if (!this.anime.data.length || !this.manga.data.length){
      this.generateList();
    };

    for (const type of ['anime','manga']){
      for (const genre of this[type].genres){
        let arr = db[type].filter(media => {
          return media.genres.includes(genre)
          && !media.genres.includes('Hentai');
        });
        ids.push(arr[Math.floor(Math.random() * arr.length)].ids.al);
      };
    };

    const { data, errors: err } = await this._fetch(ids);
    if (err){
      errors.push(err)
    } else {
      for (const type of ['anime','manga']){
        this[type].data = data.Page.media
        .filter(x => x.type.toLowerCase() === type)
        .sort((a,b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      };
    };

    this.updated = new Date();
    return Promise.resolve({ data:{ anime: this.anime.data, manga: this.manga.data }, errors })
  };

  /**
   * Generate list for this Profile instance
   * @returns {DiscoveryProfile}
   */
  generateList(){
    const genres = [ ...constants.mediaGenres.filter(x => x !== 'Hentai')];

    for (const type of ['anime','manga']){
      if (!this[type].data.length){
        array.shuffle(genres);
        this[type].genres = Array.from({ length: 5 }, (_,i) => genres[i]);
        this.updated = new Date();
      } else {
        continue;
      };
    };
    return this;
  };

  /**
   * Clear list on this Profile Instance
   * @returns {AlinaClient}
   */
  clearList(){
    for (const type of ['anime','manga']){
      this[type] = {
        genres: [],
        data: [],
        viewcount: 0
      };
    };
    this.updated = new Date();
    return this;
  };

  /**
   * get data from this Profile Instance by category
   * @param {category} string The category to get data from.
   * @returns {[data]} Array of media objects
   */
  get(category){
    if (!this[category] || this.isExpired){
      return undefined;
    };
    this[category].viewcount++;
    return this[category].data;
  };

  /**
   * Whether the data this instance handles is already expired
   * @type {Boolean}
   * @readonly
   */
  get isExpired(){
    const now = Date.now();
    return Boolean(!this.updated || now > this.updated.getTime() + 86400000);
  };

  /**
   * Whether the this instance has been populated by data
   * @type {Boolean}
   * @readonly
   */
  get hasData(){
    return Boolean(this.anime.data.length && this.manga.data.length);
  };
};
