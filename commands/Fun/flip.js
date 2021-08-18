const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'flip',
  aliases: [ 'coinflip', 'coin', 'tosscoin', 'tc' ],
  group: 'Fun',
  description: 'Win or Lose, Flip a Coin [Head or Tails]',
  examples: [
    'flip head',
    'coinflip tail'
  ],
  run: (client, message, [choice = ''] ) => {

    if (!choice || !['head', 'tail'].some(x => choice.toLowerCase() === x)){
      return message.channel.send(`${em.error} | ${message.author}, Please specify if \`[HEAD]\` or \`[TAILS]\``);
    };

    let result;
    const won = !!Math.round(Math.random());
    const results = [ 'head', 'tail' ];
    results.splice(results.indexOf(choice), 1);

    if (won){
      result = choice;
    } else {
      [ result ] = results;
    };

    return message.channel.send([
      `${message.author} tossed a coin!`,
      `Bet: **${choice}**`,
      `Result: **${result}** ${won ? `\\${em.success}` : `${em.error}`}`
    ].join('\n'));
  }
};
