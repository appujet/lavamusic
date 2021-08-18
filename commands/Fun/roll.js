const text = require('../../util/string');

module.exports = {
  name: 'roll',
  aliases: [],
  group: 'Fun',
  description: 'Generate a random number from 1-[selected number]',
  examples: [
    'roll 10',
    'roll 100',
    'roll 1234567'
  ],
  run: (client, message, [tail]) => {

    const rand = Math.random();
    tail = Math.round(tail) || Math.round(Math.random() * 999) + 1;

    return message.channel.send(`**${text.commatize(Math.round(rand * tail))}** ---> [0 -> ${text.commatize(tail)}]`)
  }
};
