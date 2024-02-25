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
            'CREATE TABLE IF NOT EXISTS ann (annId INTEGER PRIMARY KEY, gid INTEGER, type TEXT, name TEXT, precision TEXT, vintage TEXT, hasAnilist BOOLEAN)'
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
                let jsonBody = new XMLParser().parse(xmlBody)
                this.addNewANN(jsonBody.report.item, diff)
            } , 1500)
        }
        console.log(jsonBody)
    }
    private async pullAllFromANN(): Promise<void> {
        let response = await fetch(config.annApiURL + "reports.xml?id=155&nlist=all");
        let xmlBody = await response.text();
        let jsonBody = new XMLParser().parse(xmlBody)
        this.addNewANN(jsonBody.report.item)
    }
    private addNewANN(ann: any, count: number = 0): void {
        //TODO
    }
  

}
