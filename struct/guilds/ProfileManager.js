const { Collection } = require('discord.js');

const GuildProfile = require(`./Profile`);

const profile = require(`${process.cwd()}/models/GuildProfile`);
const list = require(`${process.cwd()}/models/GuildWatchlist`);

module.exports = class GuildProfileManager{
    constructor(client){

      /**
       * The client that instantiated this Manager
       * @name GuildProfileManager#client
       * @type {AlinaClient}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client })

      /**
       * The Profiles of the guilds this instance currently handles
       * @type {Collection}
       */
      this.profiles = new Collection();

      /**
       * The Date when this Manager was last updated at.
       * @type {Date}
       */
      this.lastUpdatedAt = new Date();
    };

    /**
    * Fetches data from the database and directly loads them
    * to this manager
    * @returns {Promise<GuildProfilesManager>} This manager
    */
    async load(){
      if (!this.client.database.connected){
        await new Promise(resolve => this.client.database.db.connection.once('connected', resolve(null)));
      };

      const res = await profile.find({});

      for (const _id of this.client.guilds.cache.keys()){
        let data = res.find(r => r._id === _id);

        if (!data){
          data = await new profile({ _id }).save();
        };

        this.profiles.set(_id, new GuildProfile(data));
      };

      this.lastUpdatedAt = new Date()
      return Promise.resolve(this);
    };

    /**
     *Use of Collection#get on collection of guild profiles.
     * @param {*} key The key to get from the profiles
     * @returns {GuildProfile | undefined}
     */
    get(key){
      return this.profiles.get(key);
    };

    /**
     * Use of Collection#set on collection of guild profiles.
     * @param {*} key The key to get from the profiles
     * @param {*} value The value of the element to add
     * @returns {Collection<GuildProfile>}
     */
    set(key, value){
      this.lastUpdatedAt = new Date();
      return this.profiles.set(key, new GuildProfile(value));
    };

    /**
     * Use of Collection#has on collection of guild profiles.
     * @param {*} key - The key of the element to check for
     * @returns {boolean} `true` if the element exists, `false` if it does not exist.
     */
    has(key){
      return this.profiles.has(key);
    };

    /**
     * Use of Collection#delete on collection of guild profiles.
     * @param {*} key - The key to delete from the collection
     * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
     */
    delete(key){
      this.lastUpdatedAt = new Date();
      return this.profiles.delete(key);
    };

    /**
     * Use of Collection#clear on collection of guild profiles.
     * @returns {undefined}
     */
    clear(){
      this.lastUpdatedAt = new Date();
      return this.profiles.clear();
    };

    /**
     * Use of Collection#array on collection of guild profiles.
     * @returns {Array}
     */
    array(){
      return this.profiles.array();
    };

    /**
     * Use of Collection#keyArray on collection of guild profiles.
     * @returns {Array}
     */
    keyArray(){
      return this.profiles.keyArray();
    };

    /**
     * Use of Collection#first on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    first(amount){
      return this.profiles.first(amount);
    };

    /**
     * Use of Collection#firstKey on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    firstKey(amount){
      return this.profiles.firstKey(amount);
    };

    /**
     * Use of Collection#last on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    last(amount){
      return this.profiles.last(amount);
    };

    /**
     * Use of Collection#lastKey on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    lastKey(amount){
      return this.profiles.lastKey(amount);
    };

    /**
     * Use of Collection#random on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    random(amount){
      return this.profiles.ranom(amount);
    };

    /**
     * Use of Collection#randomKey on collection of guild profiles.
     * @param {number} amount Amount of element to be returned
     * @returns {Collection|Array<GuildProfile> | undefined}
     */
    randomKey(amount){
      return this.profiles.randomKey(amount);
    };

    /**
     * Use of Collection#find on collection of guild profiles.
     * @param {function} fn The find function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {GuildProfile | undefined}
     */
    find(fn, thisArg){
      return this.profiles.find(fn, thisArg);
    };

    /**
     * Use of Collection#findkey on collection of guild profiles.
     * @param {function} fn The find function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {GuildProfile | undefined}
     */
    findKey(fn, thisArg){
      return this.profiles.findKey(fn, thisArg);
    };

    /**
     * Use of Collection#sweep on collection of guild profiles.
     * @param {function} fn The sweep function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {GuildProfile | undefined}
     */
    sweep(fn, thisArg){
      this.lastUpdatedAt = new Date();
      return this.profiles.sweep(fn, thisArg);
    };

    /**
     * Use of Collection#filter on collection of guild profiles.
     * @param {function} fn The filter function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {GuildProfile | undefined}
     */
    filter(fn, thisArg){
      return this.profiles.filter(fn, thisArg);
    };

    /**
     * Use of Collection#partition on collection of guild profiles.
     * @param {function} fn The partition function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {GuildProfile | undefined}
     */
    partition(fn, thisArg){
      return this.profiles.partition(fn, thisArg);
    };

    /**
     * Use of Collection#flatMap on collection of guild profiles.
     * @param {function} fn The flatMap function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Array<GuildProfile> | undefined}
     */
    flatMap(fn, thisArg){
      return this.profiles.flatMap(fn, thisArg);
    };

    /**
     * Use of Collection#map on collection of guild profiles.
     * @param {function} fn The map function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Array<GuildProfile> | undefined}
     */
    map(fn, thisArg){
      return this.profiles.map(fn, thisArg);
    };

    /**
     * Use of Collection#mapValues on collection of guild profiles.
     * @param {function} fn The mapValues function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Array<GuildProfile> | undefined}
     */
    mapValues(fn, thisArg){
      return this.profiles.mapValues(fn, thisArg);
    };

    /**
     * Use of Collection#some on collection of guild profiles.
     * @param {function} fn The some function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Boolean}
     */
    some(fn, thisArg){
      return this.profiles.some(fn, thisArg);
    };

    /**
     * Use of Collection#every on collection of guild profiles.
     * @param {function} fn The every function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Boolean}
     */
    every(fn, thisArg){
      return this.profiles.every(fn, thisArg);
    };

    /**
     * Use of Collection#reduce on collection of guild profiles.
     * @param {function} fn The reduce function to execute.
     * @param {*} initialValue starting value of the accumulator
     * @returns {*}
     */
    reduce(fn, initialValue){
      return this.profiles.reduce(fn, initialValue);
    };

    /**
     * Use of Collection#each on collection of guild profiles.
     * @param {function} fn The each function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Collection}
     */
    each(fn, thisArg){
      return this.profiles.each(fn, thisArg);
    };

    /**
     * Use of Collection#tap on collection of guild profiles.
     * @param {function} fn The tap function to execute.
     * @param {*} thisArg arg for `this` context to be used.
     * @returns {Collection}
     */
    tap(fn, thisArg){
      return this.profiles.tap(fn, thisArg);
    };

    /**
     * Use of Collection#clone on collection of guild profiles.
     * @returns {Collection}
     */
    clone(){
      this.lastUpdatedAt = new Date();
      return this.profiles.clone();
    };

    /**
     * Use of Collection#concat on collection of guild profiles.
     * @param {*...Collection} collections Collection to merge.
     * @returns {Collection}
     */
    concat(...collections){
      this.lastUpdatedAt = new Date();
      return this.profiles.concat(collections);
    };

    /**
     * Use of Collection#concat on collection of guild profiles.
     * @param {Collection} collections Collection to compare with.
     * @returns {boolean}
     */
    equals(collection){
      return this.profiles.equals(collection);
    };

    /**
     * Use of Collection#tap on collection of guild profiles.
     * @param {Function} compareFunction The function to execute.
     * @returns {Collection}
     */
    sort(compareFunction){
      return this.profiles.sort(compareFunction);
    };

    /**
     * Use of Collection#intersect on collection of guild profiles.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    intersect(other){
      return this.profiles.intersect(other);
    };

    /**
     * Use of Collection#difference on collection of guild profiles.
     * @param {Collection} other The other Collection to filter against
     * @returns {Collection}
     */
    difference(other){
      return this.profiles.difference(other);
    };

    /**
     * Use of Collection#tap on collection of guild profiles.
     * @param {Function} compareFunction The function to execute.
     * @returns {Collection}
     */
    sorted(compareFunction){
      return this.profiles.sorted(compareFunction);
    };

    /**
     * Update a GuildProfile with the new data.
     * @param {string} id The id of the guild to update.
     * @param {*} data The updated data.
     * @returns {Collection}
     */
    update(id, data){
      this.lastUpdatedAt = new Date()
      return this.profiles.delete(id).set(id, new GuildProfile(data))
    }

    /**
     * Update a specific part of the GuildProfile with the new data.
     * @param {string} id The id of the guild to update.
     * @param {*} data The updated data.
     * @returns {void}
     * @examples manager.updateOn(guildID, {\name: welcomeChannel, update: null})
     */
    updateOn(id, data){
      this.lastUpdatedAt = new Date()
      return this.profiles.get(id)[data.name] = data.update;
    }

    /**
     * Identical to Collection#delete.
     * @param {string} id The id of the guild to delete.
     * @param {*} data The updated data.
     * @returns {Collection}
     */
    remove(id){
      return this.profiles.delete(id)
    }
};
