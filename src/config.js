module.exports = {
    token: process.env.TOKEN || "",  // your bot token
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNERID || "491577179495333903", //your discord id
    SpotifyID: process.env.SPOTIFYID || "", // spotify client id
    SpotifySecret: process.env.SPOTIFYSECRET || "", // spotify client secret
    mongourl: process.env.MONGO_URI || "", // MongoDb URL
    embedColor: process.env.COlOR || "#303236", // embed colour
    logs: process.env.LOGS || "875254787191504947", // channel id for guild create and delete logs 

    nodes: {

      host: "disbotlistlavalink.ml",
      id: "local",
      port: 443,
      password: "LAVA",
      secure: true
    
    },
 
}
