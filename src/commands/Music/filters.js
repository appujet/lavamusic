const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	name: "filters",
    category: "Music",
    aliases: [ "eq", "equalizer" ],
    description: "Set EqualizerBand",
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
            return message.reply({embeds: [thing]});
        }
        const emojiequalizer = message.client.emoji.filter;
        const embed = new MessageEmbed()
          .setColor(client.embedColor)
          .setDescription(`Choose what filter you want in tha button`)
        
        const but = new MessageButton().setCustomId("clear_but").setLabel("Clear").setStyle("DANGER");
        const but2 = new MessageButton().setCustomId("bass_but").setLabel("Bass").setStyle("PRIMARY");
        const but3 = new MessageButton().setCustomId("party_but").setLabel("Party").setStyle("PRIMARY");
        const but4 = new MessageButton().setCustomId("vapo_but").setLabel("Radio").setStyle("PRIMARY");
        const but5 = new MessageButton().setCustomId("pop_but").setLabel("Pop").setStyle("PRIMARY");
        const but6 = new MessageButton().setCustomId("trab_but").setLabel("Treblebass").setStyle("PRIMARY");
        const but7 = new MessageButton().setCustomId("boost_but").setLabel("Bass Boost").setStyle("PRIMARY");
        const but8 = new MessageButton().setCustomId("soft_but").setLabel("Soft").setStyle("PRIMARY");
        const but9 = new MessageButton().setCustomId("cust_but").setLabel("Custom").setStyle("PRIMARY");

        const row = new MessageActionRow().addComponents(but, but2, but3, but4, but5);
        const row2 = new MessageActionRow().addComponents(but6, but7, but8, but9);
        
        const m = await  message.reply({embeds: [embed], components: [row, row2]});

        const embed1 = new MessageEmbed().setColor(client.embedColor);
        const collector = m.createMessageComponentCollector({
            filter: (f) => f.user.id === message.author.id ? true : false && f.deferUpdate().catch(() => {}),
            time: 60000,
            idle: 60000/2
        });
        collector.on("end", async () => {
            if(!m) return;
           await m.edit({ embeds: [embed1.setDescription(`Time is Out type again ${prefix}filters`)]});
        });
        collector.on("collect", async (b) => {
         if(!b.replied) await b.deferUpdate({ ephemeral: true });
         if(b.customId === "clear_but") {
            await player.clearEQ();
            if(m) await m.edit({embeds: [embed], components: [row, row2]});
            return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Equalizer mode is OFF`)]});
         } else if(b.customId === "bass_but") {
            var bands = [
                { band: 0, gain: 0.6 },
                { band: 1, gain: 0.7 },
                { band: 2, gain: 0.8 },
                { band: 3, gain: 0.55 },
                { band: 4, gain: 0.25 },
                { band: 5, gain: 0 },
                { band: 6, gain: -0.25 },
                { band: 7, gain: -0.45 },
                { band: 8, gain: -0.55 },
                { band: 9, gain: -0.7 },    
                { band: 10, gain: -0.3 },    
                { band: 11, gain: -0.25 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }    
            ];
            await player.setEQ(...bands);
            if(m) await m.edit({embeds: [embed], components: [row, row2]});
            return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Bass mode is ON`)]});
         } else if(b.customId === "party_but") {
            var bands = [
                { band: 0, gain: -1.16 },
                { band: 1, gain: 0.28 },
                { band: 2, gain: 0.42 },
                { band: 3, gain: 0.5 },
                { band: 4, gain: 0.36 },
                { band: 5, gain: 0 },
                { band: 6, gain: -0.3 },
                { band: 7, gain: -0.21 },
                { band: 8, gain: -0.21 } 
            ];
             await player.setEQ(...bands);
            if(m) await m.edit({embeds: [embed], components: [row, row2]});
            return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Party mode is ON`)]});
         } else if(b.customId === "radio_but") {
            var bands = [
                { band: 0, gain: 0.65 },
                { band: 1, gain: 0.45 },
                { band: 2, gain: -0.45 },
                { band: 3, gain: -0.65 },
                { band: 4, gain: -0.35 },
                { band: 5, gain: 0.45 },
                { band: 6, gain: 0.55 },
                { band: 7, gain: 0.6 },
                { band: 8, gain: 0.6 },
                { band: 9, gain: 0.6 },    
                { band: 10, gain: 0 },    
                { band: 11, gain: 0 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }  
            ];
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Radio mode is ON`)]});
         } else if(b.customId === "pop_but") {
            var bands = [
                { band: 0, gain: -0.25 },
                { band: 1, gain: 0.48 },
                { band: 2, gain: 0.59 },
                { band: 3, gain: 0.72 },
                { band: 4, gain: 0.56 },
                { band: 5, gain: 0.15 },
                { band: 6, gain: -0.24 },
                { band: 7, gain: -0.24 },
                { band: 8, gain: -0.16 },
                { band: 9, gain: -0.16 },    
                { band: 10, gain: 0 },    
                { band: 11, gain: 0 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }
            ];
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Pop mode is ON`)]});
         } else if(b.customId === "trab_but") {
            var bands = [
                { band: 0, gain: 0.6 },
                { band: 1, gain: 0.67 },
                { band: 2, gain: 0.67 },
                { band: 3, gain: 0 },
                { band: 4, gain: -0.5 },
                { band: 5, gain: 0.15 },
                { band: 6, gain: -0.45 },
                { band: 7, gain: 0.23 },
                { band: 8, gain: 0.35 },
                { band: 9, gain: 0.45 },
                { band: 10, gain: 0.55 },
                { band: 11, gain: 0.6 },
                { band: 12, gain: 0.55 },
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }
            ];
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Trablebass mode is ON`)]});
         } else if(b.customId === "boost_but") {
            var bands = new Array(7).fill(null).map((_, i) => (
                { band: i, gain: 0.25 }
            ));
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Bassboost mode is ON`)]}); 
         } else if(b.customId === "soft_but") {
            var bands =  [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: -0.25 },
                { band: 9, gain: -0.25 },    
                { band: 10, gain: -0.25 },    
                { band: 11, gain: -0.25 },
                { band: 12, gain: -0.25 },   
                { band: 13, gain: -0.25 },   
                { band: 14, gain: -0.25 } 
            ];
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Soft mode is ON`)]});
         } else if(b.customId === "cust_but") {
            var bands = [
                { band: 0, gain: args[1] },
                { band: 1, gain: args[2] },
                { band: 2, gain: args[3] },
                { band: 3, gain: args[4] },
                { band: 4, gain: args[5] },
                { band: 5, gain: args[6] },
                { band: 6, gain: args[7] },
                { band: 7, gain: args[8] },
                { band: 8, gain: args[9] },
                { band: 9, gain: args[10] },    
                { band: 10, gain: args[11] },    
                { band: 11, gain: args[12] },
                { band: 12, gain: args[13] },   
                { band: 13, gain: args[14] }    
            ];
            await player.setEQ(...bands);
           if(m) await m.edit({embeds: [embed], components: [row, row2]});
           return await b.editReply({embeds: [embed1.setDescription(`${emojiequalizer} Custom mode is ON`)]}); 
            }
        });
    }
};