
const experience = require(`${process.cwd()}/util/xp`);

module.exports = async (client, message) => {

  if (message.author.bot){
    return;
  };
  const serverprefix = client.guildProfiles.get(message.guild.id).prefix || 'Not set' 
   if(message.content.match(new RegExp(`^<@!?${message.client.user.id}>( |)$`))){
    return message.channel.send(`${message.author}, My prefix is \`${client.config.prefix}\`, The custom prefix is \`${serverprefix}\`.`)
  } else {
    
    // Do nothing..
  };
  
  const { executed, reason } = client.commands.handle(message);
 
  const execute = Boolean(!['PERMISSION', 'TERMINATED', 'COOLDOWN'].includes(reason));
  const response = await experience(message, executed, execute);

  // Log errors not caused by the following reasons
  if (!response.xpAdded && ![
    'DISABLED', // The xp is disabled, requires `EXPERIENCE_POINTS` on client#features
    'COMMAND_EXECUTED', // The command was executed successfully
    'COMMAND_TERMINATED', // The command was fetched but was terminated
    'DM_CHANNEL', // The message was sent on a dm
    'DISABLED_ON_GUILD', // The message was disabled on guild (xp inactive)
    'DISABLED_ON_CHANNEL', // The message was sent on a blacklisted channel
    'RECENTLY_TALKED', // The message author recently talked
  ].includes(response.reason)){
    message.client.logs.push(`XP error: ${response.reason} on ${message.guild.id}<${message.guild.id}> by ${message.author.tag}<${message.author.id}> at ${new Date()}`);
  };
  
  return;
};
