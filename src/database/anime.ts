import Database from 'better-sqlite3';
import { XMLParser } from 'fast-xml-parser';

import config from '../config.js';

const db = new Database('./database/anime.db', {
    fileMustExist: false,
    readonly: false,
});
db.pragma('journal_mode=WAL');
export default class AnimeData {
    constructor() {
        this.intialize();
    }
    public intialize(): void {
        db.prepare(
            'CREATE TABLE IF NOT EXISTS ann (annId INTEGER PRIMARY KEY, gid INTEGER, type TEXT, name TEXT, precision TEXT, vintage TEXT, hasAnilist BOOLEAN, hasAnisong BOOLEAN)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anilistmedia (anilistMediaId INTEGER PRIMARY KEY, annId INTEGER)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anisong (anisongId INTEGER PRIMARY KEY, annId INTEGER, anilistMediaId INTEGER, url TEXT, songType TEXT, anisongType TEXT, animeEng TEXT, animeJap TEXT, songName TEXT)'
        ).run();
        const data: any = db.prepare('SELECT * FROM ann LIMIT 1').get();
        if (!data) {
            this.pullAllFromANN();
        }
        setInterval(this.pullRecentFromANN, 86400000)
        
    }
    private async pullRecentFromANN(): Promise<void> {
        let maxAnnId: any = db.prepare(
            'SELECT MAX(annId) from ann'
        ).get();
        let response = await fetch(config.annApiURL + "reports.xml?id=155&nlist=1");
        let xmlBody = await response.text();
        let jsonBody = new XMLParser().parse(xmlBody)
        let diff = jsonBody.report.item.id - maxAnnId;
        if (diff != 0) {
            setTimeout( async (diff) => {
                let response = await fetch(config.annApiURL + "reports.xml?id=155&nlist=" + diff);
                let xmlBody = await response.text();
                let jsonBody = new XMLParser().parse(xmlBody);
                if (diff == 1) {
                    this.addNewANN(jsonBody.report.item);
                } else {
                    jsonBody.report.item.forEach(element => {
                        this.addNewANN(element);
                    });
                }
                
            } , 1500)
        }
        console.log(jsonBody)
    }
    private async pullAllFromANN(): Promise<void> {
        //let response = await fetch(config.annApiURL + "reports.xml?id=155&nlist=all");
        let response = await fetch(config.annApiURL + "reports.xml?id=155&type=anime&nlist=50");

        let xmlBody = await response.text();
        let jsonBody = new XMLParser().parse(xmlBody)

        jsonBody.report.item.forEach(element => {
            this.addNewANN(element);
        });
    }
    private addNewANN(ann: any): void {
        //TODO: Check Anilist and Anisong
        this.addAnnToDB(ann.id, ann.gid, ann.type, ann.name, ann.precision, false, false);
    }
    private addAnnToDB(annId: number, annGid: number, annType:string, annName:string, annPrecision:string, hasAnilist: boolean, hasAnisong: boolean): void {
        db.prepare('INSERT INTO ann (annId, gid, type, name, precision, hasAnilist, hasAnisong) VALUES(?, ?, ?, ?, ?, ?, ?)').run(annId, annGid, annType, annName, annPrecision, hasAnilist, hasAnisong);
    }
    private addAnisongToDB(anisongId: number, annId: number, anilistMediaId: number, url: string, songType: string, anisongType: string, animeEng: string, animeJap: string, songName: string): void {
        db.prepare('INSERT INTO ann (anisongId, annId, anilistMediaId, url, songType, anisongType, animeEng, animeJap, songName) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)').run(anisongId, annId, anilistMediaId, url, songType, anisongType, animeEng, animeJap, songName);
    }
    private addAnilistMediaToDB(anilistId: number, annId: number): void {
        db.prepare('INSERT INTO anilistmedia (anilistId, annId) VALUES(?, ?)').run(anilistId, annId);
    }

  

}
