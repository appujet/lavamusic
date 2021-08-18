const _ = require('lodash');
const { randomQuote } = require('animequotes');
const em = require('../../assets/json/emojis.json');
const { createCanvas, registerFont } = require('canvas');
registerFont(`${process.cwd()}/assets/fonts/handwriting.ttf`, { family: 'Handwriting' });

module.exports = async (options) => {

  let quote;
  do {
     quote = randomQuote().quote
  } while (quote.split(/ +/).length > 30)

  const array = quote.split(/ +/);
  const description = _.chunk(array, 6);
  const canvas = createCanvas(300, description.length * 25 + 10);
  const ctx = canvas.getContext('2d');

  const { client, message, title, args, doc } = options;

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.fillStyle = '#27292b';
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.font = '20px Handwriting';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';

  description.forEach((item, i) => {
    ctx.fillText(item.join(' '), canvas.width / 2, 25 * (i + 1), canvas.width - 10);
  });

  const attachment = canvas.toBuffer();
  const name = 'typequiz.png';
  const files = [ { attachment, name }];
  const prompt = `**${message.author.tag}**, type the following sentence/paragraph under 45 seconds:`

  await message.channel.send(prompt, { files });

  const filter = _message => message.author.id === _message.author.id;
  const opt = { max: 1, time: 45000, errors: ['time'] };
  const response = await message.channel.awaitMessages(filter, opt)
  .then(collected => {
    const content = collected.first().content.toLowerCase();
    if (content === quote.toLowerCase()){
      return { };
    } else {
      return { err: 'INCORRECT_CODE' };
    };
  })
  .catch(() => {
    hasNotEnded = false;
    return { err: 'TIMEOUT' };
  });

  const reason = {
    INCORRECT_CODE: 'You didn\'t type the sentence/paragraph correctly!',
    TIMEOUT: 'You ran out of time!'
  };

  let win = !response.err,  overflow = false, excess = null;
  const amount = win ? 500 : 250;

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
        `${em.error} | **${message.author.tag}**, ${reason[response.err]}`,
        `You received **${amount}** credits for trying!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount - excess} for this one!` : '',
      ].join('\n'))
    } else {
      return message.channel.send([
        `${em.success} | **${message.author.tag}**, Congratulations!`,
        `You received **${amount}** credits for typing the sentence/paragraph correctly!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount - excess} for this one!` : '',
      ].join('\n'))
    };
  })
  .catch(() => message.channel.send(`${em.success} | \`[DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
};
