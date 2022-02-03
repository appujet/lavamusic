const MusicBot = require("./structures/MusicClient");
const client = new MusicBot();

const keepAlive = require('./server.js')
keepAlive()

client.connect()

module.exports = client; 
