const { Collection } = require('discord.js');

module.exports = class Collections{
  constructor(array = []){

    /**
     * The Collections set via {@link} Client#defineCollections
     * @type {Collection}
     */
    for (const element of array){
      this[element] = new Collection();
    };
  };

  /**
   * Whether the key exists in the collection
   * @param {string} collection The name of the collection to query with
   * @param {*} key The key of the element in the collection to check for
   * @returns {boolean} `true` if the key exist in the queried collection, `false` if collection or the key does not exist
   */
  exists(collection, key){
    return Boolean(this[collection] && this[collection].has(key));
  };

  /**
   * Add a new collection to this Collections
   * @param {string} collection The name of the collection to add
   * @returns {Collections}
   */
  add(collection){
    if (this[collection]) throw new TypeError(`Collection named ${collection} already exist.`)

    this[collection] = new Collection()

    return this
  };

  /**
   * Get an element from a collection
   * @param {string} collection The name of the collection to get from
   * @param {*} key The key of the element in the collection
   * @returns {Collection}
   */
  getFrom(collection, key){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].get(key)
  };

  /**
   * Get the first element from a collection
   * @param {string} collection The name of the collection to get from
   * @param {number} amount The amount of elements to get
   * @returns {* | undefined}
   */
  getFirst(collection, amount){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].first(amount)
  };

  /**
   * Get the last element from a collection
   * @param {string} collection The name of the collection to get from
   * @param {number} amount The amount of elements to get
   * @returns {* | undefined}
   */
  getLast(collection, amount){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].first(amount)
  };

  /**
   * Get random element(s) from a collection
   * @param {string} collection The name of the collection to get from
   * @param {number} amount The amount of elements to get
   * @returns {* | undefined}
   */
  getRandom(collection, amount){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].random(amount)
  };

  /**
   * Get random element(s) from a collection
   * @param {string} collection The name of the collection to find from
   * @param {function} fn the find function to use
   * @param {*} thisArg arg for `this` context to be used
   * @returns {* | undefined}
   */
  findFrom(collection, fn, thisArg){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].find(fn, thisArg)
  };

  /**
   * Set new element in a collection
   * @param {string} collection The name of the collection to set to
   * @param {*} key The key to get from the collection
   * @param {*} value The value of the element to add
   * @returns {Collection}
   */
  setTo(collection, key, value){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].set(key, value)
  };

  /**
   * deletes an element in a collection
   * @param {string} collection The name of the collection to set to
   * @param {*} key The key to delete
   * @returns {* | undefined}
   */
  deleteIn(collection, key){
    if (!this[collection]) throw new TypeError(`Collection named "${collection}" does not exist on Personalized Collections.`)

    return this[collection].delete(key)
  };

};
