const text = require(`${process.cwd()}/util/string`);
const em = require('../assets/json/emojis.json');
module.exports = async (client, guild) => {

  const owner = await client.users.fetch(guild.ownerID)
  .then(owner => owner.tag)
  .catch(() => '<Unfetched Data>');

  const members = text.commatize(guild.memberCount);
  const message = `${em.leave} : **${members}** members, owned by **${owner}**`;
 
  await client.channels.cache.get(client.config.channels.logs).createWebhook(guild.name, {
    avatar: guild.iconURL({ format: 'png', dynamic: true, size: 128 })
  })
  .then(webhook => Promise.all([webhook.send(message), webhook]))
  .then(([_, webhook]) => webhook.delete())
  .catch(() => {});
  //=====================================================//

  // add more functions on guildDelete event callback function...

  return;
};
