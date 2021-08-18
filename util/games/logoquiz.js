const { createCanvas, loadImage } = require('canvas');
const logos = require(`${process.cwd()}/assets/json/logoquiz.json`);
const em = require('../../assets/json/emojis.json');
module.exports = async (options) => {

  const meta =  logos[Math.floor(Math.random() * logos.length)];

  const canvas = createCanvas(396, 264);
  const ctx = canvas.getContext('2d');
  const logo = await loadImage(meta.url);

  const { client, message, title, args, doc } = options;

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.fillStyle = '#27292b';
  ctx.fill();

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;

  ctx.drawImage(logo, 0, 0, 396, 264);

  const attachment = canvas.toBuffer();
  const name = 'logoquiz.png';
  const files = [ { attachment, name }];
  const prompt = `**${message.author.tag}**, guess the logo under 30 seconds:`;
  const clue = meta.name.replace(/\w/ig,'_').split('').join(' ');

  await message.channel.send(`${prompt}\n\`${clue}\``, { files });

  const filter = _message => message.author.id === _message.author.id;
  const opt = { max: 1, time: 30000, errors: ['time'] };
  const response = await message.channel.awaitMessages(filter, opt)
  .then(collected => {
    const content = collected.first().content.toLowerCase();
    if (content === meta.name.toLowerCase()){
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
    INCORRECT_CODE: `Incorrect guess! The answer was **${meta.name}**`,
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
        `You received **${amount}** credits for guessing the logo correctly!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount - excess} for this one!` : '',
      ].join('\n'))
    };
  })
  .catch(() => message.channel.send(`${em.error} | \`[DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
};
