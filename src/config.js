module.exports = {
    token: process.env.TOKEN || "ODkwMjk1MDMyOTQxMjc3MTk1.YUtt3A.FIKuF9HXIjhGXbwtCvlA0oI8Uuw",  // your bot token
    prefix: process.env.PREFIX || "&", // bot prefix
    ownerID: process.env.OWNERID || "491577179495333903", //your discord id
    SpotifyID: process.env.SPOTIFYID || "69ebbd15cba9474a9d46e5aa95733b15", // spotify client id
    SpotifySecret: process.env.SPOTIFYSECRET || "185da21de3904b7db61d4d12c455c166", // spotify client secret
    mongourl: process.env.MONGO_URI || "mongodb+srv://blacky:testmongo@cluster0.ssqzd.mongodb.net/testbeta", // MongoDb URL
    embedColor: process.env.COlOR || "#303236", // embed colour
    logs: process.env.LOGS || "875254787191504947", // channel id for guild create and delete logs 

  nodes: {
     
      host: "18.219.253.190",
      port: 80,
      password: "LAVA",
      secure: false
    
    },
 
}
