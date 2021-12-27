<div align = "center">
<a href="https://www.npmjs.com/package/erela.js-deezer">
<img src="https://img.shields.io/npm/dw/erela.js-deezer?color=CC3534&logo=npm&style=for-the-badge" alt="Downloads">
</a>

<a href="https://www.npmjs.com/package/erela.js-deezer">
<img src="https://img.shields.io/npm/v/erela.js-deezer?color=red&label=Version&logo=npm&style=for-the-badge" alt="Npm version">
</a>
<br>

<a href="https://github.com/WearifulCupid0/erela.js-deezer">
<img src="https://img.shields.io/github/stars/wearifulcupid0/erela.js-deezer?color=333&logo=github&style=for-the-badge" alt="Github stars">
</a>

<a href="https://github.com/WearifulCupid0/erela.js-deezer/blob/master/LICENSE">
<img src="https://img.shields.io/github/license/wearifulcupid0/erela.js-deezer?color=6e5494&logo=github&style=for-the-badge" alt="License">
</a>
<hr>
</div>
This a plugin for Erela.JS to allow the use of Deezer URL's, it uses direct URL's being tracks, albums, and playlists and gets the YouTube equivalent.

- https://www.deezer.com/track/1174602992
- https://www.deezer.com/album/192713912
- https://www.deezer.com/playlist/3110429622

## Documentation & Guides

It is recommended to read the documentation to start, and the guides to use the plugin.

- [Documentation](https://solaris.codes/projects/erelajs/docs/gettingstarted.html#getting-started 'Erela.js Documentation') 

- [Guides](https://solaris.codes/projects/erelajs/guides/introduction.html 'Erela.js Guides')

## Installation

**NPM** :
```sh
npm install erela.js-deezer
```

**Yarn** :
```sh
yarn add erela.js-deezer
```

## Options

- ### playlistLimit
> The amount of pages to load when a playlist is searched with each page having 100 tracks. \
> By default this retrieves all tracks in the playlist. \
> Note: This must be 1 or higher, 0 will load all.

- ### albumLimit
> The amount of pages to load when an album is searched with each page having 50 tracks. \
> By default this retrieves all tracks on the album. \
> Note: This must be 1 or higher, 0 will load all.

- ### convertUnresolved
> Converts all UnresolvedTracks into a Track. \
> **NOTE: THIS IS NOT RECOMMENDED AS IT WILL ATTEMPT TO CONVERT EVERY TRACK, INCLUDING ALBUMS AND PLAYLISTS TRACKS.** \
> **DEPENDING ON THE AMOUNT THIS WILL TAKE A WHILE AND MAY RATELIMIT YOUR LAVALINK NODE.**

## Example Usage

```javascript
const { Manager } = require("erela.js");
const Deezer  = require("erela.js-deezer");

const manager = new Manager({
  plugins: [
    // Initiate the plugin
    new Deezer()
  ]
});

manager.search("https://www.deezer.com/track/1174602992");
```
