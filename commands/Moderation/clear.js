const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const em = require('../../assets/json/emojis.json');
module.exports = {
  name: 'clear',
  aliases: [ 'delete', 'slowprune', 'sd', 'slowdelete' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES' ],
  clientPermissions: [ 'MANAGE_MESSAGES', 'EMBED_LINKS' ],
  group: 'Moderation',
  description: 'Delete messages from this channel. Will not delete messages older than two (2) weeks.',
  parameters: [ 'Quantity of Message' ],
  examples: [
    'clear 10',
    'delete 99',
    'slowprune 50'
  ],
  run: async (client, message, [quantity]) => {

    quantity = Math.round(quantity);

    if (!quantity || quantity < 2 || quantity > 100){
      return message.channel.send(`${em.error} | ${message.author}, Please provide the quantity of messages to be deleted which must be greater than two (2) and less than one hundred (100)`);
    };

    return message.channel.bulkDelete(quantity, true)
    .then(async messages => {
      const { color } = client.config;
      const count = messages.size;
      const _id = Math.random().toString(36).slice(-7);
      const uploadch = client.channels.cache.get(client.config.channels.uploads);

      messages = messages.filter(Boolean).map(message => {
        return [
          `[${moment(message.createdAt).format('dddd, do MMMM YYYY hh:mm:ss')}]`,
          `${message.author.tag} : ${message.content}\r\n\r\n`
        ].join(' ');
      });

      messages.push(`Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`);
      messages = messages.reverse().join('');

      const res = uploadch ? await uploadch.send(
        `BULKDELETE FILE - ${message.guild.id} ${message.channel.id}`,
        { files: [{ attachment: Buffer.from(messages), name: `bulkdlt-${_id}.txt`}]}
      ).then(message => [message.attachments.first().url, message.attachments.first().id])
      .catch(() => ['', null]) : ['', null];

      const url = (res[0].match(/\d{17,19}/)||[])[0];
      const id = res[1];

      return message.channel.send(
        `${em.success} | Successfully deleted **${count}** messages from this channel!`,
        new MessageEmbed()
        .setColor(color)
        .setDescription([
          `[\`📄 View\`](${url ? `https://txt.discord.website/?txt=${url}/${id}/bulkdlt-${_id}`:''})`,
          `[\`📩 Download\`](${res[0]})`
        ].join('\u2000\u2000•\u2000\u2000'))
      );
    });
  }
}
