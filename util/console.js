
/**
 * Logs on console with color green
 * @param {string} message The message to log on console
 * @param {string} title The string to apply the color to
 * @returns {undefined}
 */
function success(message, title = 'SUCCESS!'){
  return console.log('\x1b[32m', title, '\x1b[0m', message);
};

/**
 * Logs on console with color yellow
 * @param {string} message The message to log on console
 * @param {string} title The string to apply the color to
 * @returns {undefined}
 */
function warn(message, title = 'WARN!'){
  return console.log('\x1b[33m', title, '\x1b[0m', message);
};

/**
 * Logs on console with color red
 * @param {string} message The message to log on console
 * @param {string} title The name of the error
 * @returns {undefined}
 */
function error(message, title = ''){
  return console.log(title ,'\x1b[31mERR!\x1b[0m', message);
};

module.exports = { success, warn, error }
