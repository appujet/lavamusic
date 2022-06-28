const { Message } = require("discord.js");
const { Structure } = require("erela.js");

Structure.extend(
  "Player",
  (Player) =>
    class extends Player {
      /**
       * Sets now playing message for deleting next time
       * @param {Message} message
       */
      async setNowplayingMessage(message) {
        if (this.nowPlayingMessage) {
          await this.nowPlayingMessage.delete();
        }
        return (this.nowPlayingMessage = message);
      }
    }
);
