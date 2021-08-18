const { MessageEmbed } = require('discord.js');
const _embed = require('./embed');
const em = require('../../assets/json/emojis.json');
function error(message, options = {}){
  // options.type -> Error type
  // options.title -> The error title
  // options.subtitle -> The sub of the title
  // option.source -> The source url for the guide

  return message.channel.send(
    new MessageEmbed()
    .setColor('RED')
    .setFooter(`${options.type} | \©️${new Date().getFullYear()} ALi`)
    .setDescription([
      `${em.error}\u2000\u2000|\u2000\u2000${options.title}\n\n`,
      options.subtitle ? options.subtitle + '\n' : '',
      `[**Learn More**](${options.source}) on how to configure ALi's ${options.type} feature.`
    ].join(''))
  );
};

function saveDocument(document, message, options = {}){
  return document.save()
  .then(() => message.channel.send(
    new MessageEmbed()
    .setColor('GREEN')
    .setFooter(`${options.type} | \©️${new Date().getFullYear()} ALi`)
    .setDescription([
      `\u2000\u2000|\u2000\u2000${options.title}\n\n`,
      options.subtitle ? options.subtitle + '\n' : '',
      `[**Learn More**](${options.source}) on how to configure ALi's ${options.type} feature.`
    ].join(''))
  ));
};

function parseMessage(str, variables){
  const test = new RegExp(Object.keys(variables).map((k) => {
    return `(${k})`
  }).join('|'), 'g')
  return str.replace(test, function(match){
    return variables[match];
  });
};

function checkStats(str){
  return str.match(/default|(msg|embed)=true|(msg|embed)=set|test/)
}

function embed(...args){
  return _embed(...args);
};

module.exports = {
  error, saveDocument, parseMessage, checkStats, embed
};
