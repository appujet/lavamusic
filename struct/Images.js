const images = require(`${process.cwd()}/assets/json/images.json`);
const mai = require(`${process.cwd()}/assets/json/mai.json`);

module.exports = class ImageGenerator{
  constructor(){
    /**
		 * Array of action images imported from assets/json/images.json
		 * @type {action[]}
     * @private
     */
    this.__action = images;

    /**
		 * Array of mai images imported from assets/json/mai.json
		 * @type {mai[]}
     * @private
     */
    this._mai = mai;

    /**
		 * The base url of these images
		 * @type {string}
     */
    this.base_url = 'https://i.imgur.com/'

    /**
		 * The ext name of these images
		 * @type {string}
     */
    this.ext = '.gif'
  };

  /**
  * Return an image url based on the provided action type
  * @param {type} imagetype The type of image to get a url from.
  * @returns {URL} An image url
  */
  _action(type){
    const index = Math.floor(Math.random() * this.__action[type].length);
    const code = this.__action[type][index] || null;
    return this.base_url + code + this.ext;
  };

  /**
  * Grab an action image of type `baka`
  * Has an imgur hash `52EuSyG`
  * @returns {URL} An image url
  */
  baka(){
    return this._action('baka');
  };

  /**
  * Grab an action image of type `blush`
  * @returns {URL} An image url
  */
  blush(){
    return this._action('blush');
  };

  /**
  * Grab an action image of type `cry`
  * @returns {URL} An image url
  */
  cry(){
    return this._action('cry');
  };

  /**
  * Grab an action image of type `dance`
  * @returns {URL} An image url
  */
  dance(){
    return this._action('dance');
  };

  /**
  * Grab an action image of type `disgust`
  * Has an imgur hash `cCFIVPt`
  * @returns {URL} An image url
  */
  disgust(){
    return this._action('disgust');
  };

  /**
  * Grab an action image of type `feed`
  * Has an imgur hash `0gVm3xW`
  * @returns {URL} An image url
  */
  feed(){
    return this._action('feed');
  };

  /**
  * Grab an action image of type `happy`
  * @returns {URL} An image url
  */
  happy(){
    return this._action('happy');
  };

  /**
  * Grab an action image of type `holdhands`
  * @returns {URL} An image url
  */
  holdhands(){
    return this._action('holdhands');
  };

  /**
  * Grab an action image of type `hug`
  * @returns {URL} An image url
  */
  hug(){
    return this._action('hug');
  };

  /**
  * Grab an action image of type `kick`
  * @returns {URL} An image url
  */
  kick(){
    return this._action('kick');
  };

  /**
  * Grab an action image of type `kill`
  * @returns {URL} An image url
  */
  kill(){
    return this._action('kill');
  };

  /**
  * Grab an action image of type `kiss`
  * Has an imgur hash `3ZIkRhL`
  * @returns {URL} An image url
  */
  kiss(){
    return this._action('kiss');
  };

  /**
  * Grab an action image of type `lick`
  * @returns {URL} An image url
  */
  lick(){
    return this._action('lick');
  };

  /**
  * Grab an action image of type `midfing`
  * @returns {URL} An image url
  */
  midfing(){
    return this._action('midfing');
  };

  /**
  * Grab an action image of type `pat`
  * Has an imgur hash `IMvNdsx`
  * @returns {URL} An image url
  */
  pat(){
    return this._action('pat');
  };

  /**
  * Grab an action image of type `poke`
  * Has an imgur hash `wR6YcFn`
  * @returns {URL} An image url
  */
  poke(){
    return this._action('poke');
  };

  /**
  * Grab an action image of type `slap`
  * Has an imgur hash `5MKjJrr`
  * @returns {URL} An image url
  */
  slap(){
    return this._action('slap');
  };

  /**
  * Grab an action image of type `sleep`
  * @returns {URL} An image url
  */
  sleep(){
    return this._action('sleep');
  };

  /**
  * Grab an action image of type `smile`
  * @returns {URL} An image url
  */
  smile(){
    return this._action('smile');
  };

  /**
  * Grab an action image of type `smug`
  * Has an imgur hash `OrUO5Kc`
  * @returns {URL} An image url
  */
  smug(){
    return this._action('smug');
  };

  /**
  * Grab an action image of type `suicide`
  * Has an imgur hash `S9ZEqeY`
  * @returns {URL} An image url
  */
  suicide(){
    return this._action('suicide');
  };

  /**
  * Grab an action image of type `tickle`
  * Has an imgur hash `iGROmvW`
  * @returns {URL} An image url
  */
  tickle(){
    return this._action('tickle');
  };

  /**
  * Grab an action image of type `wave`
  * Has an imgur hash `iGROmvW`
  * @returns {URL} An image url
  */
  wave(){
    return this._action('wave');
  };

  /**
  * Grab an action image of type `wink`
  * Has an imgur hash `iGROmvW`
  * @returns {URL} An image url
  */
  wink(){
    return this._action('wink');
  };

  /**
  * Grab a `mai` image
  * @returns {URL} An image url
  */
  mai(r = {}){
    const type = r.nsfw && typeof r.nsfw === 'boolean' ? 'nsfw' : 'safe';
    const index = Math.floor(Math.random() * this._mai[type].length);

    return this._mai[type][index];
  };

  /**
  * The number of images this instance currently holds
  * @type {Object}
  * @readonly
  */
  get size(){
    const profiles = { mai: {}};

    for (const profile of Object.keys(this.__action)){
      profiles[profile] = this.__action[profile].length;
    };

    for (const s of Object.keys(this._mai)){
      profiles.mai[s] = this._mai[s].length
    };

    return profiles;
  };
};
