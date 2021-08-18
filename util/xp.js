const { Collection } = require('discord.js');
const profileSchema = require(`${process.cwd()}/models/Profile`);

async function experience(message, command_executed, execute){

  // Do not add xp if XP is disabled
  if (!message.client.features.includes('EXPERIENCE_POINTS')){
    return Promise.resolve({ xpAdded: false, reason: 'DISABLED' });
  };

  // Do not add xp if the command was executed
  if (command_executed){
    return Promise.resolve({ xpAdded: false, reason: 'COMMAND_EXECUTED' });
  };

  // Do not add xp if the command was terminated
  if (!execute){
    return Promise.resolve({ xpAdded: false, reason: 'COMMAND_TERMINATED' });
  };

  // Do not add xp when messages are coming from DMs
  if (message.channel.type === 'dm'){
    return Promise.resolve({ xpAdded: false, reason: 'DM_CHANNEL'});
  };

  // Define xp monitor and get the guildprofile of the guild the user
  // is a member of
  let xp = message.client.collections.getFrom('xp', message.guild.id);
  let gs = message.client.guildProfiles.get(message.guild.id);

  // Create an xp monitor if none exist.
  if (!xp){
    const collections = message.client.collections.setTo('xp', message.guild.id, new Collection());
    xp = collections.get(message.guild.id);
  } else {
    // Do nothing.
  };

  // Check if the xp is disabled on the server

  if (!gs){
    return Promise.resolve({ xpAdded: false, reason: 'DATABASE_NOT_FOUND' })
  };

  if (!gs.xp.isActive){
    return Promise.resolve({ xpAdded: false, reason: 'DISABLED_ON_GUILD' });
  };

  // Check if the xp is disabled on the channel
  if (gs.xp.exceptions.includes(message.channel.id)){
    return Promise.resolve({ xpAdded: false, reason: 'DISABLED_ON_CHANNEL' });
  };

  // Check if user has recently talked
  if (xp.has(message.author.id)){
    return Promise.resolve({ xpAdded: false, reason: 'RECENTLY_TALKED' });
  };

  // Check if the database is connected
  if (!message.client.database.connected){
    return Promise.resolve({ xpAdded: false, reason: 'DB_DISCONNECT'});
  };

  // Define maximum and minimum amount of xp
  const max = 25;
  const min = 10;
  const points = Math.floor(Math.random() * (max-min)) + min;


  let res = await profileSchema.findOne({ _id: message.author.id }) ||
  await new profileSchema({ _id: message.author.id }).save();

  // Check if the data returned is a valid
  if (!(res instanceof profileSchema)){
    return promise.resolve({ xpAdded: false, reason: 'DB_ERROR'})
  };

  /*=======================CALCULATE XP============================*/
  // Some weird math goes here...

  // Get the server data
  let index = res.data.xp.findIndex(x => x.id === message.guild.id);
  let serverdata;

  // Add serverdata to profile if it doesn't exist yet
  // -1 means the index couldn't be found
  if (index === -1){
    res.data.xp.push({
      id: message.guild.id,
      xp: 0,
      level: 1
    });
    index = res.data.xp.findIndex(x => x.id === message.guild.id);
    [ serverdata ] = res.data.xp.splice(index,1);
  } else {
    [ serverdata ] = res.data.xp.splice(index,1);
  };

  // define points
  let _xp = {
    global: {
      get cap(){ return (50 * Math.pow(res.data.global_level,2)) + (250 * res.data.global_level); },
      get next(){ return this.cap -  res.data.global_xp; },
    },
    local: {
      get cap(){ return (50 * Math.pow(serverdata.level,2)) + (250 * serverdata.level); },
      get next(){ return this.cap - serverdata.xp }
    }
  };

  // PROCESS GLOBAL XP
  // Add 3xp xp add on global based xp
  // Increment level if next is less than the current xp
  res.data.global_xp = res.data.global_xp + 3;
  while (_xp.global.next < 1){
    res.data.global_level++
  };

  // PROCESS LOCAL XP
  // Add points which was previously randomized on server[local] based xp
  // increment level if next is less than the current xp.
  serverdata.xp = serverdata.xp + points;
  while (_xp.local.next < 1){
    serverdata.level++
  };

  // Add xpdata again to the xp array of the profile
  // index = where the serverdata is inserted
  // 0 = number of elements to remove
  // serverdata = the inserted data
  res.data.xp.splice(index, 0, serverdata);

  // Save the new data
  return res.save()
  .then(() => {
    xp.set(message.author.id, {});
    setTimeout(() => xp.delete(message.author.id), 60000);
    return { xpAdded: true, reason: null };
  })
  .catch(() => {
    return { xpAdded: false, reason: 'DB_ERROR_ON_SAVE' }
  });
};

module.exports = experience;
