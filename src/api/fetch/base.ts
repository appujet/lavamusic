const BASE_URLS = {
  discord: "https://discord.com/api/v10",
};

const createApiInstance = (baseURL: string) => {
  return async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<T>;
  };
};

export const discordApi = createApiInstance(BASE_URLS.discord);
