import Event from "../../structures/Event.js";
import Dispatcher from "../../structures/Dispatcher.js";

export default class TrackStart extends Event {
    constructor(...args) {
        super(...args, {
        });
    }
    /**
     * 
     * @param {import('shoukaku').Player} player 
     * @param {import('shoukaku').Track} track 
     * @param {import('discord.js').TextChannel} channel 
     * @param {import('shoukaku').Track[]} matchedTracks 
     * @param {Dispatcher} dispatcher 
     */
    async run(player, track, channel, matchedTracks, dispatcher) {
        const embed = this.client.embed()            .setTitle('Now Playing')
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .setThumbnail(await dispatcher.displayThumbnail(track.info.ur))
            .setFooter({ text: `Requested by ${dispatcher.requester.tag}`, iconURL: dispatcher.requester.avatarURL({ dynamic: true }) })
            .setColor(this.client.color.default)
        const message = await channel.send({ embeds: [embed] });
       
    }
}