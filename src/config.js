module.exports = {
    token: process.env.TOKEN || "",  // your bot token
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNERID || "491577179495333903", //your discord id
    SpotifyID: process.env.SPOTIFYID || "", // spotify client id
    SpotifySecret: process.env.SPOTIFYSECRET || "", // spotify client secret
    mongourl: process.env.MONGO_URI || "", // MongoDb URL
    embedColor: process.env.COlOR || "#303236", // embed colour
    logs: process.env.LOGS || "", // guild create and delete logs

  nodes: {
     
      host: process.env.HOST || "disbotlistlavalink.ml",
      port: process.env.PORT || 443,
      password: process.env.PASS || "LAVA",
      id: process.env.ID || "DisBotlist Lavalink",
      retryDelay: 3000,
      secure: process.env.SECURE || true
    
    },
 
}
