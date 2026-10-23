import { type ButtonInteraction, MessageFlags } from "discord.js";
import { Component, type Lavamusic } from "../../structures";
import { t } from "../../structures/I18n";
import { handlePlayerInteraction, updatePlayerMessage } from "../../utils/PlayerUIUtils";

export default class ForwardButton extends Component {
	constructor(client: Lavamusic) {
		super(client, {
			name: "forward",
			aliases: ["FORWARD_BUT"],
		});
	}

	public async run(interaction: ButtonInteraction): Promise<any> {
		const player = await handlePlayerInteraction(this.client, interaction);
		if (!player) return;

		const time = player.position + 10000;
		if (time >= player.queue.current!.info.duration) {
			return await interaction.reply({
				content: t(($) => $.events.setupButton.forward_limit),
				flags: MessageFlags.Ephemeral,
			});
		}

		player.seek(time);
		await interaction.deferUpdate();
		await updatePlayerMessage(
			this.client,
			interaction,
			player,
			t(($) => $.events.setupButton.forwarded),
		);
	}
}
