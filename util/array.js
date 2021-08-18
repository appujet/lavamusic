'use-strict';

/**
 * Shuffles the original array
 * @param {Array} array the array to shuffle
 * @returns {void}
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  };
};


module.exports = { shuffle };
