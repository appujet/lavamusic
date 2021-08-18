module.exports = {
  name: 'invert',
  aliases: [],
  group: 'Fun',
  description: 'Invert the colors on user avatar',
  clientPermissions: [ 'ATTACH_FILES' ],
  parameters: [ 'User ID', 'User Mention' ],
  examples: [
    'invert @user',
    'invert 721612345678987654456'
  ],
  run: async (client, message ) => {

    const match = message.content.match(/\d{17,19}/);
    let user;

    if (message.guild){
      const member = await message.guild.members
      .fetch((match || [message.author.id])[0])
      .catch(() => message.member);

      user = member.user;
    } else {
      user = message.author;
    };

    return message.channel.send({
      files: [{
        name: 'inverted.png',
        attachment: [
          'https://some-random-api.ml/canvas/invert?avatar=',
          user.displayAvatarURL({ format: 'png', size: 1024 })
        ].join('')
      }]
    });
  }
};
