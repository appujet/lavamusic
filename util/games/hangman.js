const { MessageEmbed } = require('discord.js');
const em = require('../../assets/json/emojis.json');
const { randomQuote } = require('animequotes');
const attachment = `${process.cwd()}/assets/images/30-sec-timer.gif`;
const hangs = [
   '/---|\n|\n|\n|\n|',
   '/---|\n|   o\n|\n|\n|',
   '/---|\n|   o\n|   |\n|\n|',
   '/---|\n|   o\n|  /|\n|\n|',
   '/---|\n|   o\n|  /|\\\n|\n|',
   '/---|\n|   o\n|  /|\\\n|  /\n|',
   '/---|\n|   o ~ GAME OVER!\n|  /|\\\n|  / \\\n|'
];

module.exports = async (options) => {
  let prhase = '';
  do {
    phrase = randomQuote().anime.toUpperCase();
  } while (phrase.length <= 8 || phrase.length >= 16 );

  let stage = 0, incguess = [], corguess = [], word = phrase.replace(/\w/ig,'_'), hasEnded = false
  const { client, message, title, args, doc } = options;
  const { color } = client.config;
  const build = () => {
    const embed = new MessageEmbed()
    .setColor(color)
    .setAuthor('ANIME HANGMAN', hasEnded ? null : 'attachment://timer.gif')
    .setDescription('Guess the word (anime title)')
    .setFooter(`Game: Hangman | \©️${new Date().getFullYear()} ALi`)
    .addFields([
      { name: 'Player', value: `\`\`\`properties\n${hangs[stage]}\n\`\`\``, inline: true },
      {
        name: message.author.tag, inline: true,
        value: [
          `Word: \`${word.split('').join(' ')}\``,
          `Guesses: \`${corguess.join(',') || '\u200b'}\``,
          `Misses: \`${incguess.join(',') || '\u200b'}\``,
          `Tries Remaining: **${hangs.length - (stage + 1)}**`
        ].join('\n')
      }
    ]);

    if (!hasEnded){
      embed.attachFiles([{ attachment, name: 'timer.gif' }])
    };

    return embed;
  };

  const reveal = (char) => {
    phrase.split('').forEach((letter, index) => {
      if (char === letter){
        const arr = word.split('');
        arr[index] = char;
        word = arr.join('');
      } else {
        // Do nothing...
      };
    });
    return;
  };

  const execute = async () => {
    await message.channel.send(build());

    const filter = _message => message.author.id === _message.author.id && _message.content.length === 1 && ![...incguess, ...corguess].includes(_message.content.toUpperCase());
    const options = { max: 1, time: 30000, errors: ['time'] };
    const response = await message.channel.awaitMessages(filter, options)
    .then(collected => {
      const content = collected.first().content.toUpperCase();
      if (phrase.includes(content)){
        corguess.push(content)
        reveal(content);
        return;
      } else {
        incguess.push(content)
        stage++;
        return;
      };
    })
    .catch((err) => {
      incguess.push('⌛');
      stage++;
      return;
    });

    if (word === phrase || stage === hangs.length - 1){
      hasEnded = true;
    };
    return Promise.resolve();
  };

  do {
    await execute();
  } while (!hasEnded);

  await message.channel.send(build());

  const win = word === phrase;
  const amount = win ? incguess.length ? 1000 : 1200 : 300;
  let overflow = false; excess = null;

  if (doc.data.economy.wallet + amount > 50000){
    overflow = true;
    excess = doc.data.economy.wallet + amount - 50000
    doc.data.economy.wallet = 50000;
  } else {
    doc.data.economy.wallet += amount;
  };

  return doc.save()
  .then(() => {
    if (!win){
      return message.channel.send([
        `${em.error} | **${message.author.tag}**, **0** tries remaining!`,
        `The correct answer was **${phrase}**`,
        `You received **${amount}** credits for trying!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount - excess} for this one!` :''
      ].join('\n'))
    } else {
      return message.channel.send([
        `${em.success} | **${message.author.tag}**, Congratulations!`,
        `You got the correct answer! You received **1,000** credits for solving the hangman puzzle.`,
        !incguess.length ? `Wow, you scored the hangman perfectly! You received additional **200** credits for such feat!` : '',
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount - excess} for this one!` :''
      ].join('\n'))
    }
  })
};
