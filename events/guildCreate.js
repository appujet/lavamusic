const guilds = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const text = require(`${process.cwd()}/util/string`);
const em = require('../assets/json/emojis.json');
module.exports = (client, guild) => guilds.findById(guild.id, async (err, doc) => {


  const owner = await client.users.fetch(guild.ownerID)
  .then(owner => owner.tag)
  .catch(() => '<Unfetched Data>');

  const members = text.commatize(guild.memberCount);
  const message = `${em.join} : **${members}** members, owned by **${owner}**`;

  if (err){
    client.channels.cache.get(client.config.channels.debug).send(`${em.error} \`[DATABASE_ERR]:\` The database responded with error: ${err.name}`);
  } else {
    if (!doc){
      doc = await new guilds({ _id: guild.id }).save();
    };
    client.guildProfiles.set(guild.id, doc);
  };
  
  await client.channels.cache.get(client.config.channels.logs).createWebhook(guild.name, {
    avatar: guild.iconURL({ format: 'png', dynamic: true, size: 128 })
  })
  .then(webhook => Promise.all([webhook.send(message), webhook]))
  .then(([_, webhook]) => webhook.delete())
  .catch(() => {});
  //=====================================================//

  // add more functions on message guildCreate callback function...

  return;
});
