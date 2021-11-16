module.exports = {
    token: process.env.TOKEN || "", 
    prefix: process.env.PREFIX || "!",
    ownerID: process.env.OWNERID || "491577179495333903",
    SpotifyID: process.env.SPOTIFYID || "",
    SpotifySecret: process.env.SPOTIFYSECRET || "",
    mongourl: process.env.MONGO_URI || "",
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
