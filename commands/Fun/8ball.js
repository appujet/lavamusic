const Badwords = require('bad-words');
const badWords = new Badwords();
const eightball = [
  'It is certain.'
  , 'It is decidedly so.'
  , 'Without a doubt.'
  , 'Yes - definitely.'
  , 'You may rely on it.'
  , 'As I see it, yes.'
  , 'Most likely.'
  , 'Outlook good.'
  , 'Yes.'
  , 'Signs point to yes.'
  , 'Reply hazy, try again.'
  , 'Ask again later.'
  , 'Better not tell you now.'
  , 'Cannot predict now.'
  , 'Concentrate and ask again.'
  , 'Don\'t count on it.'
  , 'My reply is no.'
  , 'My sources say no.'
  , 'Outlook not so good.'
  , 'Very doubtful.'
];

module.exports = {
  name: '8ball',
  aliases: [ '🎱', '8b', '8-ball', 'eightball' ],
  group: 'Fun',
  description: 'Ask anything on the magic 8-ball',
  parameters: [ 'Question answerable by Yes/No' ],
  examples: [
    '8ball is Alina a good bot?',
    '🎱 is FMA worth of it\'s top spot?',
    '8b is BNHA good',
    '8-ball Do you want to play Among us?',
    'eightball Have you been in a tight spot before?'
  ],
  run: (client, message, args) => {

    if (!args.length){
      return message.channel.send(`Ask me anything...`, { replyTo: message})
    };

    if (badWords.isProfane(message.content)){
      return message.channel.send(`I can't reply to question with something profane on it..`, { replyTo: message })
    };

    const response = eightball[Math.floor(Math.random() * eightball.length)];

    return message.channel.send(response, { replyTo: message });
  }
};
