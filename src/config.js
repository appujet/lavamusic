module.exports = {
    token: process.env.TOKEN || "ODkyNjMyMTM1MDk2MjA5NDI4.YVPudQ.4H46V2RRtYdvQdbc78dhA7N4pxk", 
    prefix: process.env.PREFIX || "!",
    ownerID: process.env.OWNERID || "491577179495333903",
    SpotifyID: process.env.SPOTIFYID || "69ebbd15cba9474a9d46e5aa95733b15",
    SpotifySecret: process.env.SPOTIFYSECRET || "185da21de3904b7db61d4d12c455c166",
    mongourl: process.env.MONGO_URI || "mongodb+srv://blacky:testmongo@cluster0.ssqzd.mongodb.net/test",
    embedColor: process.env.COlOR || "#303236",
    logs: process.env.LOGS || "",

  nodes: {
     
      host: process.env.HOST || "disbotlistlavalink.ml",
      port: process.env.PORT || 443,
      password: process.env.PASS || "LAVA",
      id: process.env.ID || "DisBotlist Lavalink",
      retryDelay: 3000,
      secure: process.env.SECURE || true
    
    },
 
}
