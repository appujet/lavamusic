const { createCanvas, registerFont } = require('canvas');
const _ = require('lodash');
registerFont(`${process.cwd()}/assets/fonts/captcha.ttf`, { family: 'Captcha'});
const em = require('../../assets/json/emojis.json');{}
module.exports = async (options) => {

const char = String.fromCharCode(...Array(123).keys()).replace(/\W/g,'');
const code = (length) => _.sampleSize(char, length).join('');
let length = 5;
let hasNotEnded = true;
let basecredits = 200;
let captchacount = 0;

const { client, message, title, args, doc } = options;

await message.channel.send([
  'Solve the succeeding captcha in under 15 seconds:',
  '- First question grants you 300 credits',
  '- Solving succeeding captchas earns 100 credits',
  '- Captchas are case sensitive',
  '- Succeeding captchas becomes longer the more you solve them.',
  '- Game begins in 5 seconds...'
].join('\n'))

await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

const execute = async () => {

    const canvas = createCanvas(150,50);
    const ctx = canvas.getContext('2d');
    const codetext = code(length);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fillStyle = '#27292b';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Captcha';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(codetext, 75, 35, 140);

    const attachment = canvas.toBuffer();
    const name = 'captcha.png';
    const files = [ { attachment, name }];
    const prompt = `**${message.author.tag}**, Solve the following captcha under 15 seconds:`

    await message.channel.send(prompt, { files });

    const filter = _message => message.author.id === _message.author.id;
    const options = { max: 1, time: 15000, errors: ['time'] };
    const response = await message.channel.awaitMessages(filter, options)
    .then(collected => {
      const content = collected.first().content;
      if (content === codetext){
        captchacount++;
        basecredits += 100;
        return {};
      } else {
        hasNotEnded = false;
        return { err: 'INCORRECT_CODE' };
      };
    })
    .catch(() => {
      hasNotEnded = false;
      return { err: 'TIMEOUT' };
    });

    if (response.err){
      const reason = {
        INCORRECT_CODE: 'You entered the wrong code!',
        TIMEOUT: 'You ran out of time!'
      };
      return message.channel.send(`${em.error} | **${message.author.tag}**, ${reason[response.err]}`);
    };

    await message.channel.send(`${em.success} | **${message.author.tag}**, you answered the captcha! Added 100 credits!`);
    length++;

    return Promise.resolve();
  };

  do {
    await execute();
  } while (hasNotEnded);

  let win = basecredits > 200, overflow = false, excess = null;;

  if (doc.data.economy.wallet + basecredits > 50000){
    overflow = true;
    excess = doc.data.economy.wallet + basecredits - 50000
    doc.data.economy.wallet = 50000;
  } else {
    doc.data.economy.wallet += basecredits;
  };

  return doc.save()
  .then(() => {
    if (!win){
      return message.channel.send([
        `${em.error} | **${message.author.tag}**, you lost on your first attempt.`,
        'You received 200 credits for trying!',
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${basecredits-excess} for this one!` :'',
      ].join('\n'));
    } else {
      return message.channel.send([
        `${em.success} | **${message.author.tag}**, Congratulations!`,
        `You received **${basecredits}** for solving ${captchacount} captcha(s)!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${basecredits-excess} for this one!` :'',
      ].join('\n'));
    }
  })
  .catch(() => message.channel.send(`${em.error} | \`[DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
};
