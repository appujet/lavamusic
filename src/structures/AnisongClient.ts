import { isNullOrUndefined } from 'util';
import config from '../config.js';
export default class AnisongClient {
    constructor() {}
    public async getAnisongDataFromANNId(annId: number, ignoreDuplicate: boolean = false, openingFilter: boolean = true, endingFilter: boolean = true, insertFilter: boolean = true): Promise<AnisongData[]> {
        let response = await fetch(config.anisongApiURL + "annId_request", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "annId":annId,
                "ignore_duplicate":ignoreDuplicate,
                "opening_filter":openingFilter,
                "ending_filter":endingFilter,
                "insert_filter":insertFilter
            })
        })
        let jsonText = await response.text()
        let json = JSON.parse(jsonText)
        let anisongs: AnisongData[]
        json.forEach(element => {
            if (element.audio != "" && element.audio != undefined && element.audio != null) {
                let anisongdata = new AnisongData(element.annSongId, element.annId, element.audio, element.songType, element.animeEnName, element.animeJPName, element.songName, element.animeType)
                anisongs.push(anisongdata);
            }
        });
        return anisongs;
    }

}
export class AnisongData {
    constructor(anisongId: number, annId: number, url: string, anisongType: string, animeEng: string, animeJap: string, songName: string, animeType: string) {
        this.anisongId = anisongId;
        this.annId = annId;
        this.url = url;
        this.anisongType = anisongType;
        this.animeEng = animeEng;
        this.animeJap = animeJap;
        this.songName = songName;
        this.animeType = animeType
        if (this.anisongType.includes("Opening")) {
            this.songType = "OP";
        } else if (this.anisongType.includes("Ending")) {
            this.songType = "ED";
        } else if (this.anisongType.includes("Insert")) {
            this.songType = "IN";
        } else {
            this.songType = "UNKNOWN"
        }
    }
    public anisongId: number;
    public annId: number;
    public url: string;
    public songType: string;
    public anisongType: string;
    public animeEng: string;
    public animeJap: string;
    public songName: string;
    public animeType: string;
}