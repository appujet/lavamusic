import { Command, type Context, type Lavamusic } from "../../structures/index";
import { EmbedLinks, ReadMessageHistory, SendMessages, ViewChannel } from "../../utils/Permissions";

export default class Resume extends Command {
	constructor(client: Lavamusic) {
		super(client, {
			name: "resume",
			description: {
				content: ($) => $.commands.resume.description,
				examples: ["resume"],
				usage: "resume",
			},
			category: "music",
			aliases: ["r"],
			cooldown: 3,
			args: false,
			vote: false,
			player: {
				voice: true,
				dj: false,
				active: true,
				djPerm: null,
			},
			permissions: {
				dev: false,
				client: [SendMessages, ReadMessageHistory, ViewChannel, EmbedLinks],
				user: [],
			},
			slashCommand: true,
			options: [],
		});
	}

	public async run(client: Lavamusic, ctx: Context): Promise<any> {
		const player = client.manager.getPlayer(ctx.guild.id);
		const embed = this.client.embed();
		if (!player) return await ctx.sendMessage(ctx.locale(($) => $.events.message.no_music_playing));
		if (!player.paused) {
			return await ctx.sendMessage({
				embeds: [
					embed
						.setColor(this.client.color.red)
						.setDescription(ctx.locale(($) => $.commands.resume.errors.not_paused)),
				],
			});
		}

		player.resume();
		return await ctx.sendMessage({
			embeds: [
				embed
					.setColor(this.client.color.main)
					.setDescription(ctx.locale(($) => $.commands.resume.messages.resumed)),
			],
		});
	}
}
