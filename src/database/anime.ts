import Database from 'better-sqlite3';

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
            'CREATE TABLE IF NOT EXISTS ann (annId INTEGER PRIMARY KEY, gid INTEGER, type TEXT, name TEXT, precision TEXT, vintage TEXT)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anilistmedia (anilistMediaId INTEGER PRIMARY KEY, annId INTEGER)'
        ).run();
        db.prepare(
            'CREATE TABLE IF NOT EXISTS anisong (anisongId INTEGER PRIMARY KEY, annId INTEGER, anilistMediaId INTEGER, url TEXT, songType TEXT, anisongType TEXT, animeEng TEXT, animeJap TEXT, songName TEXT)'
        ).run();
    }


}
