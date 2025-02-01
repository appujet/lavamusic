import { Socket } from "socket.io";
import { Lavamusic } from "../..";
import { Player } from "lavalink-client";
import { ChannelType, PermissionsBitField } from "discord.js";
import { env } from "../../../env";

export default function playerEvents(socket: Socket, client: Lavamusic) {
  const handleError = (socket: Socket, event: string, message: string) => {
    socket.emit(`${event}:error`, { message });
  };
  const djPermission = async (
    memberId: string,
    guildId: string,
  ): Promise<boolean> => {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return false;
    const member = await guild.members.fetch(memberId).catch(() => null);
    if (!member) return false;
    const dj = await client.db.getDj(guildId);
    // If DJ mode is not enabled, the user has permission
    if (!dj?.mode) return true;
    // Check for admin or manage guild permissions first
    if (
      member.permissions.has(PermissionsBitField.Flags.Administrator) ||
      member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) {
      return true;
    }
    // Fetch DJ roles from the database
    const djRoles = await client.db.getRoles(guildId);
    const roles = djRoles.map((r) => r.roleId);
    return roles.some((roleId) => member.roles.cache.has(roleId));
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
      return handleError(
        socket,
        "player:update",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );

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
          "Member not found in the server.",
        );
      const channel = guild?.channels.cache.get(voiceChannelId);
      if (!channel || member.voice.channel?.id !== channel.id) {
        return handleError(
          socket,
          "player:connect",
          "You must be in the voice channel to connect.",
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
          `**Web Player**: Successfully connected to [**Dashboard**](${env.NEXT_PUBLIC_BASE_URL}/guild/${guildId})`,
        );

      textChannel.send({ embeds: [embed] });
    },
  );

  socket.on("player:disconnect", async ({ guildId, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:disconnect",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );

    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:disconnect",
        "You don't have the required permission to disconnect. Only users with DJ roles are allowed to do.",
      );
    const guild = client.guilds.cache.get(guildId);
    const member = await guild?.members.fetch(userId);

    if (!member)
      return handleError(
        socket,
        "player:dicsonnect",
        "Member not found in the server.",
      );
    const channel = guild?.channels.cache.get(player.voiceChannelId!);
    if (!channel || member.voice.channel?.id !== channel.id) {
      return handleError(
        socket,
        "player:disconnect",
        "You must be in the voice channel to disconnect.",
      );
    }
    const textChannel = guild?.channels.cache.get(player.textChannelId!);
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
        `**Web Player**: Successfully disconnected By - ${member.user.username}`,
      );

    textChannel.send({ embeds: [embed] });
    player.destroy();

    socket.emit("player:disconnect:success", { connected: false });
  });

  socket.on("player:control:playpause", async ({ guildId, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:playpause",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to play/pause. Only users with DJ roles are allowed to do.",
      );
    player.paused ? player.resume() : player.pause();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:previous", async ({ guildId, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:previous",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to play previous. Only users with DJ roles are allowed to do.",
      );
    const previousTrack = player.queue.previous[0];
    player.play({ track: previousTrack });
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:skip", async ({ guildId, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player || !player.queue.tracks.length) {
      return handleError(socket, "player:control:skip", "No tracks to skip.");
    }
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to skip. Only users with DJ roles are allowed to do.",
      );
    player.skip();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:seek", async ({ guildId, userId, position }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:seek",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to seek. Only users with DJ roles are allowed to do.",
      );
    player.seek(position);
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:volume", async ({ guildId, userId, volume }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:volume",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to change volume. Only users with DJ roles are allowed to do.",
      );
    player.setVolume(volume);
    emitPlayerUpdate(socket, player);
  });

  socket.on(
    "player:control:removeTrack",
    async ({ guildId, userId, index }) => {
      const player = client.manager.getPlayer(guildId);
      if (!player)
        return handleError(
          socket,
          "player:control:removeTrack",
          "No active player found. Please make sure there's a player currently running in the guild.",
        );
      const isDJ = await djPermission(userId, guildId);
      if (!isDJ)
        return handleError(
          socket,
          "player:control",
          "You don't have the required permission to remove track. Only users with DJ roles are allowed to do.",
        );
      player.queue.remove(index);
      emitPlayerUpdate(socket, player);
    },
  );

  socket.on("player:control:playTrack", async ({ guildId, userId, index }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:playTrack",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to play track. Only users with DJ roles are allowed to do.",
      );
    const track = player.queue.tracks[index];
    player.queue.remove(index);
    player.play({ track });
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:shuffle", async ({ guildId, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:shuffle",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to shuffle. Only users with DJ roles are allowed to do.",
      );
    player.queue.shuffle();
    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:loop", async ({ guildId, userId, loop }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:loop",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = await djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to loop. Only users with DJ roles are allowed to do.",
      );
    if (loop) player.repeatMode = "track";
    else player.repeatMode = "off";
    player.setRepeatMode(loop ? "track" : "off");

    emitPlayerUpdate(socket, player);
  });

  socket.on("player:control:autoPlay", ({ guildId, userId, enabled }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:control:autoPlay",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const isDJ = djPermission(userId, guildId);
    if (!isDJ)
      return handleError(
        socket,
        "player:control",
        "You don't have the required permission to enable/disable autoplay. Only users with DJ roles are allowed to do.",
      );
    player.set("autoplay", enabled);
    emitPlayerUpdate(socket, player);
  });

  //--------------------------------------//
  //              SEARCH                  //
  //--------------------------------------//
  socket.on("player:search", async ({ guildId, query, user, source }) => {
    if (!guildId || query === "") return;

    const res = await client.manager.search(query, user, source);

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
      return handleError(
        socket,
        "player:playTrack",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );

    await player.play({
      track: { encoded: track.encoded, requester: track.requester },
    });

    emitPlayerUpdate(socket, player);
  });

  socket.on("player:addQueueOrPlay", async ({ guildId, track, userId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "player:queue",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    const member = guild.members.cache.get(userId);
    if (!member) return;
    if (!member.voice.channelId)
      return handleError(
        socket,
        "player:control",
        "You must be in a voice channel.",
      );
    if (member.voice.channelId !== player.voiceChannelId)
      return handleError(
        socket,
        "player:control",
        "You must be in the same voice channel as the bot.",
      );

    await player.queue.add(track);
    if (!player.playing && player.queue.tracks.length) player.play();
    emitPlayerUpdate(socket, player);
  });

  socket.on("voiceState", ({ guildId }) => {
    const player = client.manager.getPlayer(guildId);
    if (!player)
      return handleError(
        socket,
        "voiceState",
        "No active player found. Please make sure there's a player currently running in the guild.",
      );
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    const voiceChannel = guild.channels.cache.get(player.voiceChannelId!);
    if (!voiceChannel) return;
    if (voiceChannel.type !== ChannelType.GuildVoice) return;

    voiceChannel.members?.forEach((member) => {
      socket.emit(`${guildId}:user:connect`, { userId: member.id });
    });
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
