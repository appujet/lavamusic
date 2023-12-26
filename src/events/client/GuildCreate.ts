import { EmbedBuilder, Guild, GuildMember, TextChannel } from 'discord.js';

import { Event, Lavamusic } from '../../structures/index.js';

export default class GuildCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'guildCreate',
        });
    }
    public async run(guild: Guild): Promise<any> {
        let owner: GuildMember | undefined;
        try {
            owner = await guild.fetchOwner();
        } catch (e) {
            owner = await guild.members.fetch(guild.ownerId);
        }
        const embed = new EmbedBuilder()
            .setColor(this.client.config.color.green)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ extension: 'jpeg' }) })
            .setDescription(`**${guild.name}** has been added to my guilds!`)
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
                    name: 'Joined At',
                    value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>`,
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
