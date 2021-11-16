const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "filter",
    category: "Music",
    aliases: [ "eq", "equalizer" ],
    description: "Set EqualizerBand",
    args: true,
    usage: "<Party || Bass || Radio || Pop || Trablebass || Soft || Custom || Off>",
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

        let thing = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            
        if (args[0] == 'party') {
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
            thing.setDescription(`${emojiequalizer} Party mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'bass') {
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
            thing.setDescription(`${emojiequalizer} Bass mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'radio') {
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
            thing.setDescription(`${emojiequalizer} Radio mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'pop') {
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
            thing.setDescription(`${emojiequalizer} Pop mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'trablebass') {
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
            thing.setDescription(`${emojiequalizer} Trablebass mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] === "Bassboost" || args[0] == 'bassboost') {
            var bands = new Array(7).fill(null).map((_, i) => (
                { band: i, gain: 0.25 }
            ));
            thing.setDescription(`${emojiequalizer} Bassboost mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'soft') {
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
            thing.setDescription(`${emojiequalizer} Soft mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'custom') {
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
            thing.setDescription(`${emojiequalizer} Custom Equalizer mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] === "Off" || args[0] == 'off') {
            thing.setDescription(`${emojiequalizer} Equalizer mode is OFF`);
            player.clearEQ();
        }
        return message.reply({embeds: [thing]});
    }
};