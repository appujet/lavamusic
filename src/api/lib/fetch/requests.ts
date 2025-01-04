
export const API_ENDPOINTS = {
  discord: "https://discord.com/api/v10",
};


export const fetchDiscord = async (endpoint: string, options?: RequestInit) => {
  try {
    const res = await fetch(`${API_ENDPOINTS.discord}${endpoint}`, options);
    return res.json();
  } catch (error) {
    console.error(error);
  }
};


export const getUserGuilds = async (token: string) => {
  const res = await fetchDiscord("/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
