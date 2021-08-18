
/**
 * _command -> Validates the command
 * @param {Command} command The command to check validation
 * @returns {Boolean} Whether the command passes the validation check
 */
function _command(command){

  if (command.rankcommand){
    if (!command.client.features.includes('EXPERIENCE_POINTS')){
      return false;
    } else {
      // Do nothing..
    };
  };

  if (command.database){
    if (!command.client.features.includes('DATABASE')){
      return false;
    } else {
      // Do nothing..
    };
  };

  return true;
};

module.exports = { _command };
