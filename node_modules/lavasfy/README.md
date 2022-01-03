# lavasfy [![npm](https://img.shields.io/npm/v/lavasfy)](https://npmjs.com/package/lavasfy "lavasfy")
Spotify album, playlist, and track resolver for Lavalink.

## Installing
```sh
# npm
npm i lavasfy

# yarn
yarn add lavasfy
```

## Example Usage
```js
const { LavasfyClient } = require("lavasfy");

const lavasfy = new LavasfyClient({
    clientID: "a client id",
    clientSecret: "a client secret"
}, [
    {
        id: "main",
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
        secure: false
    }
]);

(async () => {
    // We need to call this to get the Spotify API access token (only needs once after the LavasfyClient instantiated).
    await lavasfy.requestToken();

    // Select node to use with its id.
    const node = lavasfy.getNode("main");

    // Use Node#load to load album, playlist, and track
    const album = await node.load("https://open.spotify.com/album/4sZni6V6NvVYhfUFGqKuR3");
    console.log(album);

    const playlist = await node.load("https://open.spotify.com/playlist/2NdDBIGHUCu977yW5iKWQY");
    console.log(playlist);

    const track = await node.load("https://open.spotify.com/track/4zsxBgPkUFYEoOGDncGIBd");
    console.log(track);

    // Response object: https://github.com/Allvaa/lava-spotify/blob/master/src/typings/Lavalink/index.ts#L22
})();
```
[Documentation](https://allvaa.github.io/lava-spotify "Documentaion")
