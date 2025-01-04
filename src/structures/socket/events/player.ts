import { Socket } from "socket.io";
import { Lavamusic } from "../..";


export default function playerEvents(socket: Socket, client: Lavamusic) {
  // player events [player create, player destroy, track start, track end]

  socket.on("player:create", (data: { guildId: string }) => {
    if (!data.guildId) {
      return socket.emit("player:create:error", "Guild ID is required!");
    }

    socket.join(data.guildId);

    client.logger.info(`[Socket] Player created: ${data.guildId}`);

    const player = client.manager.getPlayer(data.guildId);

    if (!player) {
      return socket.emit("player:create:error", "Player not found!");
    }

    return socket.emit("player:create:success", {
      connected: player?.connected,
      textChannelId: player?.textChannelId,
      voiceChannelId: player?.voiceChannelId,
      volume: player?.volume,
    });
  });

  socket.on("player:trackStart", (data: { guildId: string }) => {
    if (!data.guildId) {
      return socket.emit("player:trackStart:error", "Guild ID is required!");
    }
    socket.join(data.guildId);

    const player = client.manager.getPlayer(data.guildId);

    if (!player) {
      return socket.emit("player:trackStart:error", "Player not found!");
    }

    return socket.emit("player:trackStart:success", {
      connected: player?.connected,
      textChannelId: player?.textChannelId,
      voiceChannelId: player?.voiceChannelId,
      volume: player?.volume,
    });
  });

    socket.on("player:connect", async (data: { guildId: string, textChannelId: string, voiceChannelId: string, user: any }) => {
        if (!data.guildId) {
            return socket.emit("player:connect:error", "Guild ID is required!");
        }
        // check is user connected to voice channel
        const guild = client.guilds.cache.get(data.guildId);
        if (!guild) {
            return socket.emit("player:connect:error", "Guild not found!");
        }
        const member = guild.members.cache.get(data.user.id);
        if (!member) {
            return socket.emit("player:connect:error", "Member not found!");
        }
        const channel = guild.channels.cache.get(data.voiceChannelId);
        if (!channel) {
            return socket.emit("player:connect:error", "Voice channel not found!");
        }
        if (!member.voice.channel) {
            return socket.emit("player:connect:error", "You are not in a voice channel!");
        }
        if (member.voice.channel.id !== channel.id) {
            return socket.emit("player:connect:error", "You are not in the same voice channel!");
        }
        // connect player
        let player = client.manager.getPlayer(data.guildId);
        if (!player) {
            player = client.manager.createPlayer({
                guildId: data.guildId,
                textChannelId: data.textChannelId,
                voiceChannelId: data.voiceChannelId,
            });
        } else {
            player.textChannelId = data.textChannelId;
            player.voiceChannelId = data.voiceChannelId;
        }
        if (!player.connected) return await player.connect();
        return player
    })
}