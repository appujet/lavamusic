const { MessageEmbed } = require('discord.js');

module.exports = class Paginate{
  constructor(...array){

    /**
		 * Array of MessageEmbed instance to paginate
		 * @type {MessageEmbed[]}
     * @private
     */
    this._array = [ ...array ].flat();

    /**
		 * the current index of this Pagination
		 * @type {number}
     * @private
     */
    this._index = 0;

    // Validate array content
    this._validate();
  };

  /**
  * Add more MessageEmbed to the array
  * @param {MessageEmbed?[]} MessageEmbed An array or a single MessageEmbed instance
  * @returns {MessageEmbed?[]} The array of the added MessageEmbeds
  */
  add(...item){
    this._array.push(...item.flat());
    this._validate()
    return [ ...item.flat() ];
  };

  /**
  * Delete some elements from the array
  * @param {number} index the index of the element to remove
  * @returns {MessageEmbed?[]} The array of the deleted MessageEmbed
  */
  delete(index){
    if (typeof index !== 'number'){
      return [];
    } else {
      if (index === this.currentIndex){
        if (this.currentIndex > 0){
          this.previous();
        };
      } else if (this.currentIndex === this.tail){
        this.previous();
      };
      return this._array.splice(index,1);
    };
  };

  /**
  * Moves the index up to view the next element from the array
  * Circular - will revert to 0 if the index exceeds array length
  * @returns {?MessageEmbed} The element from the array
  */
  next(){
    if (!this._array.length){
      return undefined;
    };
    if (this._index === this.tail) this._index = -1;
    this._index++;
    return this._array[this._index];
  }

  /**
  * Moves the index down to view the previous element from the array
  * Circular - will revert to the max index if the index is less than 0
  * @returns {?MessageEmbed} The element from the array
  */
  previous(){
    if (!this._array.length){
      return undefined;
    };
    if (this._index === 0) this._index = this.tail + 1;
    this._index--;
    return this._array[this._index];
  }

  /**
  * The current embed using the current index
  * @type {?MessageEmbed}
  * @readonly
  */
  get currentPage(){
    return this._array[this._index];
  }

  /**
  * The first embed from the array
  * @type {?MessageEmbed}
  * @readonly
  */
  get firstPage(){
    return this._array[0];
  }

  /**
  * The last embed from the array
  * @type {?MessageEmbed}
  * @readonly
  */
  get lastPage(){
    return this._array[this.tail];
  }


  /**
  * The current index
  * @type {?Number}
  * @readonly
  */
  get currentIndex(){
    return this._index
  }

  /**
  * The number of embed in the array
  * @type {?Number}
  * @readonly
  */
  get size(){
    return this._array.length;
  };

  /**
  * The last index, or null if no element.
  * @type {?Number}
  * @readonly
  */
  get tail(){
    return this._array.length > 0
    ? this._array.length - 1
    : null;
  };

  /**
  * Checks if there is a non message embed present in the array
  * @returns {?void}
  */
  _validate(){
    for (const el of this._array){
      if (!(el instanceof MessageEmbed)){
        throw new Error('Paginate: Passed argument is not an instance of MessageEmbed!')
      };
    };
    return;
  };
};
