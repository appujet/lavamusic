declare module "genius-lyrics" {
  /**
   * Represents a song returned from the Genius search.
   */
  export interface Song {
    id: number;
    title: string;
    url: string;
    /**
     * Retrieves the full lyrics of the song.
     * @returns A promise that resolves with the song lyrics.
     */
    lyrics(): Promise<string>;
    albumArt?: string;
    artist: {
      name: string;
      url?: string;
    };
  }

  /**
   * Represents an artist from Genius.
   */
  export interface Artist {
    id: number;
    name: string;
    url: string;
    image?: string;
  }

  /**
   * The Songs client with methods to search, get, or scrape songs.
   */
  export interface SongsClient {
    /**
     * Searches for songs matching the given query.
     * @param query The search query (typically a song title).
     * @returns A promise that resolves to an array of Song objects.
     */
    search(query: string): Promise<Song[]>;

    /**
     * Retrieves a song by its Genius ID.
     * @param id The Genius song ID.
     * @returns A promise that resolves to a Song object.
     */
    get(id: number): Promise<Song>;

    /**
     * Scrapes a song page given its URL.
     * @param url The URL of the Genius song page.
     * @returns A promise that resolves to a Song object.
     */
    scrape(url: string): Promise<Song>;
  }

  /**
   * The Artists client with methods to retrieve artist details.
   */
  export interface ArtistsClient {
    /**
     * Retrieves an artist by their Genius ID.
     * @param id The Genius artist ID.
     * @returns A promise that resolves to an Artist object.
     */
    get(id: number): Promise<Artist>;
  }

  /**
   * Represents a low-level request client (for internal use).
   */
  export interface RequestClient {
    base?: string;
    options?: any;
  }

  /**
   * The main Genius Client class.
   */
  export class Client {
    /**
     * Creates a new Genius Client instance.
     * @param apiKey Optional Genius API key. If not provided or empty, the client falls back to web scraping.
     */
    constructor(apiKey?: string);

    public songs: SongsClient;
    public artists: ArtistsClient;
    public request: RequestClient;
    public api: RequestClient;
  }
}