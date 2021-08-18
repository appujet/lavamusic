const Discord = require("discord.js");
const { Canvas, createCanvas, loadImage, registerFont } = require('canvas');
registerFont(`${process.cwd()}/assets/fonts/arial.ttf`, { family: 'Arial'});
module.exports = {
  name: 'nowplaying',
  aliases: ["np"],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'Music',
  description: 'Play songs from Soundcloud, Spotify or Youtube',
  examples: ['play Why by Sabrina Carpenter', 'play https://www.youtube.com/watch?v=fhH4pbRJh0k'],
  parameters: ['Song name or URl of the song or playlist'],
  run: async (client, message, args) => {
        
    const { color } = client.config;
  
   if (!message.guild.me.voice.channel)return message.channel.send("Nothing Playing Here.")
  
   
       
   if (!message.member.voice.channel)return message.channel.send("**Join** the voice channel.");
      
  
    if (message.guild.me.voice.channel !== message.member.voice.channel)return message.channel.send(`You must be in the same channel as ${message.client.user}`)
 
       
  let queue = client.distube.getQueue(message);
  
     if (!queue) return message.channel.send("There is nothing playing!")
       
        let queuesong = queue.formattedCurrentTime;

        let cursong = queue.songs[0];

        let cursongtimes = 0;
        let cursongtimem = 0;
        let cursongtimeh = 0;
        let queuetimes = 0;
        let queuetimem = 0;
        let queuetimeh = 0;
        if (cursong.formattedDuration.split(":").length === 3) {
            cursongtimes = cursong.formattedDuration.split(":")[2]
            cursongtimem = cursong.formattedDuration.split(":")[1]
            cursongtimeh = cursong.formattedDuration.split(":")[0]
        }
        if (queuesong.split(":").length === 3) {
            queuetimes = queuesong.split(":")[2]
            queuetimem = queuesong.split(":")[1]
            queuetimeh = queuesong.split(":")[0]
        }
        cursongtimes = cursong.formattedDuration.split(":")[1]
        cursongtimem = cursong.formattedDuration.split(":")[0]
        queuetimes = queuesong.split(":")[1]
        queuetimem = queuesong.split(":")[0]
        let maxduration = Number(cursongtimes) + Number(cursongtimem) * 60 + Number(cursongtimeh) * 60 * 60;
        let minduration = Number(queuetimes) + Number(queuetimem) * 60 + Number(queuetimeh) * 60 * 60;
        let percentduration = Math.floor((minduration / maxduration) * 100);

        let songtitle = cursong.name;
        let curtime = cursong.formattedDuration;
        let oftime = `${queue.formattedCurrentTime}/${cursong.formattedDuration}`
        const canvas = createCanvas(800, 200);
        const ctx = canvas.getContext('2d');
        const background = await loadImage(`${process.cwd()}/assets/bg.png`);

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const url = `https://img.youtube.com/vi/${cursong.id}/mqdefault.jpg`
        const avatar = await loadImage(url);
        ctx.drawImage(avatar, 10, 10, 192, 108);
        

        var textString = songtitle.substr(0, 35);
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#0996FF';
        ctx.fillText(textString, 10 + 192 + 10, 10 + 25);
        let textStringt
        if (songtitle.length > 40) textStringt = songtitle.substr(35, 32) + "...";
        else textStringt = "";
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#0996FF';
        ctx.fillText(textStringt, 10 + 192 + 10, 10 + 25 + 40);

        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#FF6D03';
        ctx.fillText(oftime, 10 + 192 + 10, 10 + 25 + 30 + 50);

        let percent = percentduration;
        let index = Math.floor(percent) || 10;
        let left = Number(".".repeat(index).length) * 7.9;

        if (left < 50) left = 50;

        let x = 14;
        let y = 200 - 65;
        let width = left;
        let height = 50;
        let radius = 25;

        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();

        ctx.fillStyle = '#d625ed';
        ctx.fill();


        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'nowplaying.png');

        let fastembed2 = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(cursong.name)
            .setURL(cursong.url)
            .setImage("attachment://nowplaying.png")
            .attachFiles(attachment)
        await message.channel.send(fastembed2);
        return;
    }
};