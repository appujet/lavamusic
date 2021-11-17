const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "loop",
    description: "Toggle music loop",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
         options: [
           {
             name: "input",
             description: "The looping input (track or queue).",
             type: "STRING",
             required: true,
             choices: [
               {
                 name: "track",
                 value: "track"
                        },
               {
                 name: "queue",
                 value: "queue"
                        }
                    ]
                }
            ],
           /**
            * 
            * @param {Client} client 
            * @param {CommandInteraction} interaction 
            */
    
    run: async (client, interaction) => {
        if (!interaction.replied) await interaction.deferReply().catch(() => {});
        
       const input = interaction.options.getString("input");
    
        let player = client.manager.get(interaction.guildId);
          if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }
	  	  const emojiloop = client.emoji.loop;
	  	  
        if(input === "track") {
            if(player.trackRepeat) {
                player.setTrackRepeat(false);
            return await interaction.editReply({
              embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiloop} Loop track is now disable`)]})   
            } else {
            player.setTrackRepeat(true);
            return await interaction.editReply({
              embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiloop} Loop track is now enable`)]})
          }
        } else if(input === "queue") {
            if(!player.queue.size) return await interaction.editReply({
              embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`No more songs left in the queue to loop`)]})
         if(player.queueRepeat) {
                player.setQueueRepeat(false);
            return await interaction.editReply({
              embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiloop} Loop queue is now disable`)]})
          } else {
          player.setQueueRepeat(true);
          return await interaction.editReply({
              embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiloop} Loop queue is now enable`)]})
          };
       }
    }
};
