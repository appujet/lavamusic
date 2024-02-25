import Anilist from "anilist-node";

import config from '../config.js';

export default class AnilistClient {
    private AnilistClient: Anilist
    constructor() {
        this.AnilistClient = new Anilist(config.anilistToken);
    }
    public async SearchByAnimeName(animeName: string): Promise<number> {
        let result = await this.AnilistClient.searchEntry.anime(animeName, null, 1, 1);
        let anilistId = 0;
        if (result.media.length > 0) {
            anilistId = result.media[0].id;
        }
        return anilistId;
    }
    public async SearchByMangaName(mangaName: string): Promise<number> {
        let result = await this.AnilistClient.searchEntry.manga(mangaName, null, 1, 1);
        let anilistId = 0;
        if (result.media.length > 0) {
            anilistId = result.media[0].id;
        }
        return anilistId;
    }
    public async GetAnimeById(id: number): Promise<any> {
        let result = await this.AnilistClient.media.anime(id);
        return result
    }
    public async GetMangaById(id: number): Promise<any> {
        let result = await this.AnilistClient.media.manga(id);
        return result
    }
}