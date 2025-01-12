import { Socket } from "socket.io";
import { Lavamusic } from "../..";
import { Player } from "lavalink-client";
import { ChannelType } from "discord.js";
import { env } from "../../../env";

export default function playerEvents(socket: Socket, client: Lavamusic) {
  const handleError = (socket: Socket, event: string, message: string) => {
    socket.emit(`${event}:error`, { message });
  };

  socket.on("player:create", async ({ guildId }) => {
    if (!guildId) return;
    socket.join(guildId);

    const player = client.manager.getPlayer(guildId);
    socket.emit("player:create:success", {
      connected: player?.connected,
      textChannelId: player?.textChannelId,
      voiceChannelId: player?.voiceChannelId,
      volume: player?.volume,
    });
  });

  socket.on("player:update", ({ guildId }) => {
    if (!guildId) return;

    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:update", "Player not found.");

    emitPlayerUpdate(socket, player);
  });

  socket.on(
    "player:connect",
    async ({ guildId, textChannelId, voiceChannelId, user }) => {
      if (!guildId) return;

      const guild = client.guilds.cache.get(guildId);
      const member = await guild?.members.fetch(user.id);

      if (!member)
        return handleError(
          socket,
          "player:connect",
          "Member not found in the server."
        );
      const channel = guild?.channels.cache.get(voiceChannelId);
      if (!channel || member.voice.channel?.id !== channel.id) {
        return handleError(
          socket,
          "player:connect",
          "You must be in the voice channel to connect."
        );
      }

      let player = client.manager.getPlayer(guildId);
      if (!player) {
        player = client.manager.createPlayer({
          guildId,
          textChannelId,
          voiceChannelId,
        });
      } else {
        player.textChannelId = textChannelId;
        player.voiceChannelId = voiceChannelId;
      }

      if (!player.connected) await player.connect();

      const textChannel = guild?.channels.cache.get(textChannelId);
      if (!textChannel) return;
      if (textChannel.type !== ChannelType.GuildText) return;
      const embed = client.embed();
      embed
        .setColor(client.color.main)
        .setAuthor({
          name: member.user.username,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `[Web Player] Connected to [Dashboard](${env.NEXT_PUBLIC_BASE_URL}/player/${guildId})`
        );

      textChannel.send({ embeds: [embed] });
    }
  );

  socket.on("player:disconnect", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:disconnect", "Player not found.");

    player.destroy();

    socket.emit("player:disconnect:success", { connected: false });
  });

  socket.on("player:control:playpause", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:playpause",
        "Player not found."
      );

    player.paused ? player.resume() : player.pause();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:previous", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:previous",
        "Player not found."
      );

    const previousTrack = player.queue.previous[0];
    player.play({ track: previousTrack });
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:skip", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player || !player.queue.tracks.length) {
      return handleError(socket, "player:control:skip", "No tracks to skip.");
    }

    player.skip();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:seek", ({ guildId, position }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:control:seek", "Player not found.");

    player.seek(position);
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:volume", ({ guildId, volume }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:control:volume", "Player not found.");

    player.setVolume(volume);
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:removeTrack", ({ guildId, index }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:removeTrack",
        "Player not found."
      );

    player.queue.remove(index);
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:playTrack", ({ guildId, index }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:playTrack",
        "Player not found."
      );

    const track = player.queue.tracks[index];
    player.queue.remove(index);
    player.play({ track });
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:shuffle", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:control:shuffle", "Player not found.");

    player.queue.shuffle();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:loop", ({ guildId, loop }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:control:loop", "Player not found.");

    if (loop) player.repeatMode = "track";
    else player.repeatMode = "off";
    player.setRepeatMode(loop ? "track" : "off");

    emitPlayerUpdate(socket, player);
  })

  socket.on("player:control:autoPlay", ({ guildId, enabled }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:control:autoPlay", "Player not found.");

    player.set("autoplay", enabled);
    emitPlayerUpdate(socket, player);
  });


  //--------------------------------------//
  //              SEARCH                  //
  //--------------------------------------//
  socket.on("player:search", async ({ guildId, query, user }) => {
    if (!guildId || query === "") return;
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:search", "Player not found.");

    const res = await player.search(query, user);

    if ((res && res.loadType === "empty") || res.loadType === "error")
      return handleError(socket, "player:search", "Track not found.");
    return socket.emit("player:search:success", {
      loadType: res.loadType,
      playlist: res.playlist,
      tracks: res.tracks,
    });
  });

  socket.on("player:playTrack", async ({ guildId, track }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:playTrack", "Player not found.");

    await player.play({
      track: { encoded: track.encoded, requester: track.requester },
    });

    emitPlayerUpdate(socket, player);
  });

  socket.on("player:addQueueOrPlay", async ({ guildId, track }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(socket, "player:queue", "Player not found.");

    await player.queue.add(track);
    if (!player.playing) player.play();
    emitPlayerUpdate(socket, player);
  });
}

export const emitPlayerUpdate = (socket: Socket, player: Player) => {
  socket.emit("player:update:success", {
    paused: player?.paused,
    repeat: player?.repeatMode,
    position: player?.position,
    track: player?.queue?.current,
    queue: player?.queue?.tracks,
    volume: player?.volume,
    isLooping: player?.repeatMode === "track",
    isAutoPlayEnabled: player?.get("autoplay"),
  });
};
