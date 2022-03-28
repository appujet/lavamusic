require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "",  // your bot token
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNERID || "491577179495333903", //your discord id
    mongourl: process.env.MONGO_URI || "", // MongoDb URL
    SpotifyId: process.env.SPOTIFYID || "", // Spotify client id.
    SpotifySecret: process.env.SPOTIFYSECRET || "", // spotify client secret
    embedColor: process.env.COlOR || "#303236", // embed colour
    logs: process.env.LOGS || "875254787191504947", // channel id for guild create and delete logs
    langs:  process.env.LANGS || "en", 

    nodes: [
    {
      host: process.env.NODE_HOST || "disbotlistlavalink.ml",
      identifier: process.env.NODE_ID || "local",
      port: parseInt(process.env.NODE_PORT || "80"),
      password: process.env.NODE_PASSWORD || "LAVA",
      secure: parseBoolean(process.env.NODE_SECURE || "false"),

    }
  ],

}

function parseBoolean(value){
    if (typeof(value) === 'string'){
        value = value.trim().toLowerCase();
    }
    switch(value){
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
