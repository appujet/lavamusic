import type { ButtonInteraction } from "discord.js";
import { Component, type Lavamusic } from "../../structures";
import { t } from "../../structures/I18n";
import { handlePlayerInteraction, updatePlayerMessage } from "../../utils/PlayerUIUtils";

export default class ResumeButton extends Component {
	constructor(client: Lavamusic) {
		super(client, {
			name: "resume",
			aliases: ["PAUSE_BUT"],
		});
	}

	public async run(interaction: ButtonInteraction): Promise<any> {
		const player = await handlePlayerInteraction(this.client, interaction);
		if (!player) return;

		if (player.paused) {
			player.resume();
			await interaction.deferUpdate();
			await updatePlayerMessage(
				this.client,
				interaction,
				player,
				t(($) => $.player.trackStart.resumed_by, { user: interaction.user.tag }),
			);
		} else {
			player.pause();
			await interaction.deferUpdate();
			await updatePlayerMessage(
				this.client,
				interaction,
				player,
				t(($) => $.player.trackStart.paused_by, { user: interaction.user.tag }),
			);
		}
	}
}
