import { EmbedBuilder, Guild, TextChannel } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';

export default class GuildDelete extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'guildDelete',
        });
    }
    public async run(guild: Guild): Promise<any> {
        const owner = await guild.fetchOwner();
        const embed = new EmbedBuilder()
            .setColor(this.client.config.color.red)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ extension: 'jpeg' }) })
            .setDescription(`**${guild.name}** has been removed from my guilds!`)
            .setThumbnail(guild.iconURL({ extension: 'jpeg' }))
            .addFields(
                { name: 'Owner', value: owner.user.tag, inline: true },
                { name: 'Members', value: guild.memberCount.toString(), inline: true },
                {
                    name: 'Created At',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: 'Removed At',
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: true,
                },
                { name: 'ID', value: guild.id, inline: true }
            )
            .setTimestamp();
        const channel = (await this.client.channels.fetch(
            this.client.config.logChannelId
        )) as TextChannel;
        if (!channel) return;
        return await channel.send({ embeds: [embed] });
    }
}
