
import { APIGuild, APIUser } from "discord.js";
import { discordApi } from "./base.js";
import { z } from "zod";
import { env } from "../../env.js";
import { container } from "tsyringe";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().nullable(),
  discriminator: z.string(),
});
export const discordApiService = (accessToken: string | null) => {
  const headers: { Authorization?: string } = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return {
    usersMe: async () => {
      const response = await discordApi<APIUser>("/users/@me", {
        method: "GET",
        headers,
      });

      return userSchema.parse(response);
    },

    getUserGuilds: async () => {
      const response = await discordApi<APIGuild[]>("/users/@me/guilds", {
        method: "GET",
        headers,
      });
      return response;
    },

    getToken: async (code: string) => {
      const data = new URLSearchParams({
        client_id: env.CLIENT_ID!,
        client_secret: env.CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      });
      const response = await discordApi("/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      const tokenSchema = z.object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in: z.number(),
        refresh_token: z.string().optional(),
        scope: z.string(),
      });
      return tokenSchema.parse(response);
    },

    refreshToken: async (refreshToken: string) => {
      const data = new URLSearchParams({
        client_id: env.CLIENT_ID!,
        client_secret: env.CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const response = await discordApi("/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      return response;
    },

    revokeToken: async (token: string) => {
      const data = new URLSearchParams({
        client_id: env.CLIENT_ID!,
        client_secret: env.CLIENT_SECRET!,
        token,
      });

      const response = await discordApi("/oauth2/token/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      return response;
    },
  };
};

container.register("discordApiService", { useValue: discordApiService });

export type DiscordApiService = typeof discordApiService;
