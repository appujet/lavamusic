const flags = Object.entries(require(`${process.cwd()}/assets/json/flags`));
const em = require('../../assets/json/emojis.json');
module.exports = async (options) => {

const { client, message, title, args, doc } = options;
let hasNotEnded = true, attempts = 0, basecredits = 200;


await message.channel.send([
  'Guess the succeeding country by its flag in under 30 seconds:',
  '- First question grants you 300 credits',
  '- Answering succeeding flags earns 100 credits',
  '- You only have 1 attempt per question',
  '- Game begins in 5 seconds...'
].join('\n'))

await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

const execute = async () => {

    let [code, country] = flags[Math.floor(Math.random() * flags.length)];
    country = country.split(',')[0];

    const attachment = `https://raw.githubusercontent.com/maisans-maid/country-flags/master/png250px/${code.toLowerCase()}.png`;
    const name = 'country-flag.png';
    const files = [ { attachment, name }];
    const prompt = `**${message.author.tag}**, guess the country by this flag under 30 seconds:`

    await message.channel.send(prompt, { files });

    const filter = _message => message.author.id === _message.author.id;
    const options = { max: 1, time: 30000, errors: ['time'] };
    const response = await message.channel.awaitMessages(filter, options)
    .then(collected => {
      const content = collected.first().content;
      if (content.toLowerCase() === country.toLowerCase()){
        attempts++;
        basecredits += 100;
        return {};
      } else {
        hasNotEnded = false;
        return { err: 'INCORRECT_ANS' };
      };
    })
    .catch(() => {
      hasNotEnded = false;
      return { err: 'TIMEOUT' };
    });

    if (response.err){
      const reason = {
        INCORRECT_ANS: `Wrong country! The correct answer was **${country}**`,
        TIMEOUT: `You ran out of time! The correct answer was **${country}**`
      };
      return message.channel.send(`${em.error} | **${message.author.tag}**, ${reason[response.err]}`);
    };

    await message.channel.send(`${em.success} | **${message.author.tag}**, Correct country! Added 100 credits!`);

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
        `You received **${basecredits}** for answering ${attempts} flag(s)!`,
        overflow ? `\n⚠️ | Overflow warning! Please deposit some of your account to your **bank**. You only received ${basecredits-excess} for this one!` :'',
      ].join('\n'));
    }
  })
  .catch(() => message.channel.send(`${em.error} | \`[DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
};
