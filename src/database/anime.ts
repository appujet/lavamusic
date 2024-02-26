import Database from 'better-sqlite3';
import ANNClient from '../structures/ANNClient.js';
import AnisongClient, { AnisongData } from '../structures/AnisongClient.js';
import AnilistClient from '../structures/AnilistClient.js';

import config from '../config.js';
import { CronJob } from 'cron';
import { start } from 'repl';

const db = new Database('./database/anime.db', {
    fileMustExist: false,
    readonly: false,
});
db.pragma('journal_mode=WAL');
export default class AnimeData {
    private ANNClient: ANNClient
    private AnisongClient: AnisongClient
    private AnilistClient: AnilistClient
    constructor() {
        this.intialize();
        this.ANNClient = new ANNClient();
        this.AnisongClient = new AnisongClient();
        this.AnilistClient = new AnilistClient();
    }
    public intialize(): void {
        db.prepare(
            'CREATE TABLE IF NOT EXISTS ann (annId INTEGER PRIMARY KEY, gid INTEGER, type TEXT, name TEXT, precision TEXT, vintage TEXT, hasAnilist BOOLEAN, hasAnisong BOOLEAN)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anilistmedia (anilistMediaId INTEGER PRIMARY KEY, annId INTEGER, name TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anisong (anisongId INTEGER PRIMARY KEY, annId INTEGER, anilistMediaId INTEGER, url TEXT, songType TEXT, anisongType TEXT, animeEng TEXT, animeJap TEXT, songName TEXT, animeType TEXT)'
        ).run();
        const data: any = db.prepare('SELECT * FROM ann LIMIT 1').get();
        if (!data) {
            this.pullAllFromANN();
        }
        const job1 = new CronJob('0 0 0 * * *', this.pullRecentFromANN, null, true, 'America/New_York');
        const job2 = new CronJob('0 0 0 * * 1', this.CheckAnilistAndAnisongMissing, null, true, 'America/New_York');
        
    }
    private async pullRecentFromANN(): Promise<void> {
        let maxAnnId: any = db.prepare(
            'SELECT MAX(annId) from ann'
        ).get();
        let latestANN = await this.ANNClient.getLatestANN()
        let diff = latestANN - maxAnnId;
        if (diff != 0) {
            setTimeout( async (diff) => {
                let newANNs = await this.ANNClient.getNewANNs(diff);
                if (diff == 1 && !Array.isArray(newANNs)) {
                    this.addNewANN(newANNs);
                } else if (Array.isArray(newANNs)) {
                    newANNs.forEach(element => {
                        this.addNewANN(element);
                    });
                }
            } , 1500)
        }
    }
    private async pullAllFromANN(): Promise<void> {
        let allANNs = await this.ANNClient.getAllANNs();
        allANNs.forEach(element => {
            this.addNewANN(element);
        });
    }
    private async CheckAnilistAndAnisongMissing(): Promise<void> {
        let noAnilistManga: any = db.prepare('SELECT * FROM ann WHERE hasAnilist = ? AND type = ? AND type = ?').get(false, 'manga', 'anthology');
        let noAnilistAnime: any = db.prepare('SELECT * FROM ann WHERE hasAnilist = ? AND type != ? AND type != ?').get(false, 'manga', 'anthology');
        let noAnisong: any = db.prepare('SELECT * FROM ann WHERE hasAnisong = ? AND type != ? AND type != ?').get(false, 'manga', 'anthology');
        if (noAnilistManga) { 
            noAnilistManga.forEach(async element => {
                let anilistId = await this.AnilistClient.SearchByMangaName(element.name);
                if (anilistId != 0) {
                    this.addAnilistMediaToDB(anilistId, element.annId, element.name);
                    this.setAnilistTrueOnANN(element.annId);
                }
                
            });
        }
        if (noAnilistAnime) { 
            noAnilistAnime.forEach(async element => {
                let anilistId = await this.AnilistClient.SearchByMangaName(element.name);
                if (anilistId != 0) {
                    this.addAnilistMediaToDB(anilistId, element.annId, element.name);
                    this.setAnilistTrueOnANN(element.annId);
                }
            });
        }
        if (noAnisong) { 
            noAnisong.forEach(async element => {
                let anisongData = await this.AnisongClient.getAnisongDataFromANNId(element.annId);
                if (anisongData.length > 0) {
                    let anilistId = this.getAnilistIdFromANN(element.annId);
                    anisongData.forEach(anisong => {
                        
                        this.addAnisongToDB(anisong.anisongId, anisong.annId, anilistId, anisong.url, anisong.songType, anisong.anisongType, anisong.animeEng, anisong.animeJap, anisong.songName, anisong.animeType);
                    });
                    this.setAnisongTrueOnANN(element.annId);
                }
            });
        }
    }
    private async addNewANN(ann: any): Promise<void> {
        let hasAnalist = false;
        let hasAnisong = false;
        let anisongData: AnisongData[];
        let anilistId = 0;  
        let type = ann.type.toLowerCase();        
        if (type.includes('manga') || type.includes('anthology')) {
            anilistId = await this.AnilistClient.SearchByMangaName(ann.name);
        } else if (type.includes('tv') || type.includes('ona') || type.includes('ova') || type.includes('movie') || type.includes('special')) {
            anilistId = await this.AnilistClient.SearchByAnimeName(ann.name);
            anisongData = await this.AnisongClient.getAnisongDataFromANNId(ann.id);
        } else {
            console.log("Type of '" + ann.type + "' not found for annId '" + ann.id + "'. " + ann.name);
        }
        if (anilistId != 0) {
            hasAnalist = true;  
            this.addAnilistMediaToDB(anilistId, ann.id, ann.name);
        }
        if (anisongData.length > 0) {
            hasAnisong = true;
            anisongData.forEach(anisong => {
                this.addAnisongToDB(anisong.anisongId, anisong.annId, anilistId, anisong.url, anisong.songType, anisong.anisongType, anisong.animeEng, anisong.animeJap, anisong.songName, anisong.animeType);
            });
        }
        this.addAnnToDB(ann.id, ann.gid, ann.type.toLowerCase(), ann.name, ann.precision, hasAnalist, hasAnisong);
    }
    private addAnnToDB(annId: number, annGid: number, annType:string, annName:string, annPrecision:string, hasAnilist: boolean, hasAnisong: boolean): void {
        db.prepare('INSERT INTO ann (annId, gid, type, name, precision, hasAnilist, hasAnisong) VALUES(?, ?, ?, ?, ?, ?, ?)').run(annId, annGid, annType, annName, annPrecision, hasAnilist, hasAnisong);
    }
    private addAnisongToDB(anisongId: number, annId: number, anilistMediaId: number, url: string, songType: string, anisongType: string, animeEng: string, animeJap: string, songName: string, animeType: string): void {
        db.prepare('INSERT INTO ann (anisongId, annId, anilistMediaId, url, songType, anisongType, animeEng, animeJap, songName, animeType) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(anisongId, annId, anilistMediaId, url, songType, anisongType, animeEng, animeJap, songName, animeType);
    }
    private addAnilistMediaToDB(anilistId: number, annId: number, name: string): void {
        db.prepare('INSERT INTO anilistmedia (anilistId, annId, name) VALUES(?, ?, ?)').run(anilistId, annId, name);
    }
    private setAnilistTrueOnANN(annId: number): void {
        db.prepare('UPDATE ann SET hasAnilist = true WHERE annId = ?').run(annId)
    }
    private setAnisongTrueOnANN(annId: number): void {
        db.prepare('UPDATE ann SET hasAnisong = true WHERE annId = ?').run(annId)
    }
    private getAnilistIdFromANN(annId: number): number {
        let anilistId: any = db.prepare('SELECT anilistId FROM anilistmedia WHERE annId = ? LIMIT 1').get(annId);
        if (!anilistId) {
            anilistId = 0;
        }
        return anilistId;
    }

  

}
