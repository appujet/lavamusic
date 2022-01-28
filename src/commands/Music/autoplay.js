const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "autoplay",
    aliases: ["ap"],
	category: "Music",
    description: "Toggle music autoplay",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
     execute: async (message, args, client, prefix) => {
  
        const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const autoplay = player.get("autoplay");

        const emojireplay = message.client.emoji.autoplay;

        if (autoplay === false) {
            const identifier = player.queue.current.identifier;
            player.set("autoplay", true);
            player.set("requester", message.author);
            player.set("identifier", identifier);
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            res = await player.search(search, message.author);
            player.queue.add(res.tracks[1]);
            let thing = new MessageEmbed()
                .setColor(message.client.embedColor)
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **enabled**`)
           return message.channel.send({embeds: [thing]});
        } else {
            player.set("autoplay", false);
            player.queue.clear();
            let thing = new MessageEmbed()
                .setColor(message.client.embedColor)
                .setTimestamp()
                .setDescription(`${emojireplay} Autoplay is now **disabled**`)
               
            return message.channel.send({embeds: [thing]});
        }

    }
};
