const list = new Intl.ListFormat('en');
// All functions returned from this module will now be in string format

/**
 * TextTruncate -> Shortens the string to desired length
 * @param {string} str the string to test with
 * @param {number} length the length the string should have
 * @param {string} end the end of the string indicating it's truncated
 * @returns {string} Truncated string
 */
function textTruncate(str = '', length = 100, end = '...'){
  return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
};

// extends textTruncate function -> lesser length
function truncate(...options){
  return textTruncate(...options);
};

/**
 * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
 * @param {number|string} n the Number to append ordinal suffix to
 * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
 * @returns {string} Ordinalized number
 * @note Does not support negative numbers!
 */
function ordinalize(n = 0){
  return Number(n)+[,'st','nd','rd'][n/10%10^1&&n%10]||Number(n)+'th';
};

/**
 * Converts number to string and adds a comma separator
 * @param {number|string} number the Number to convert
 * @param {number} maximumFractionDigits the number of decimal places to include in result
 * @example commatize(11235) will return `11,235`; commatize(1234.567, 2) will return `1,234.57`
 * @returns {string} number with commas
 * @note Numbers greater than 10e307 will return '∞'
 */
function commatize(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', { maximumFractionDigits });
};

/**
 * Converts a number to a stringified compact version
 * @param {number|string} number the Number to convert
 * @param {number} maximumFractionDigits the number of decimal places to include in result
 * @example compactNum(11235) will return `11.24K`; commatize(1234.567, 0) will return `1K`
 * @returns {string} compact version of the number
 * @note Maximum number for optimal usage is 10e13
 */
function compactNum(number, maximumFractionDigits = 2){
  return Number(number || '')
  .toLocaleString('en-US', {
    notation: 'compact', maximumFractionDigits
  });
};

/**
 * Joins array via oxford comma and append 'and' on last 2 items
 * @param {array} array the array to join
 * @returns {string} the joined array
 */
function joinArray(array = []){
  return list.format(array.map(x => String(x)));
};

/**
 * Join array and add a limiter.
 * @param {array} array the array to join
 * @param {number} limit the maximum length of the string output
 * @param {string} connector similar to param of `array.join()`
 * @example joinArrayAndLimit([1,2,3,4,5,6,7,8,9,10,11]) will return  text: '1, 2, 3, 4', excess: 6
 * @returns {object.text} The joined array
 * @returns {object.excess} The number of elements not included on join
 * @note Will throw a typeerror array.reduce is not a function if param1 is not of type array.
 */
function joinArrayAndLimit(array = [], limit = 1000, connector = '\n'){
  return array.reduce((a,c,i,x) => a.text.length + String(c).length > limit
  ? { text: a.text, excess: a.excess + 1 }
  : { text: a.text + (!!i ? connector : '') + String(c), excess: a.excess }
  , { text: '', excess: 0});
};

/**
 * cleans text from unnecessary character
 * @param {string} text The string to clean
 * @returns {string} the cleaned string
 */
function clean(text){
  return String(text).replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
};

module.exports = {
  textTruncate,
  truncate,
  ordinalize,
  commatize,
  compactNum,
  joinArray,
  joinArrayAndLimit,
  clean
};
