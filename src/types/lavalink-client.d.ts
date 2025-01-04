import "lavalink-client";

declare module "lavalink-client" {
  interface Track {
    requester?: {
      id: string;
      username: string;
      discriminator?: string;
      avatarURL?: string;
    };
  }
}
