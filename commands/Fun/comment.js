module.exports = {
  name: 'comment',
  aliases:[],
  guildOnly: true,
  group:'Fun',
  description: 'Comment something and return a youtube-like comment',
  clientPermissions: [ 'ATTACH_FILES' ],
  examples: [
    'comment I never thought this would be the effect.'
  ],
  run: (client ,message, args) => message.channel.send({
    files: [{
      name: 'youtube.png',
      attachment: [
        'https://some-random-api.ml/canvas/youtube-comment?avatar=',
        message.author.displayAvatarURL({format: 'png', size:1024}),
        `&username=${message.member.displayName}`,
        `&comment=${args.join(' ')}`
      ].join('')
    }]
  })
};
