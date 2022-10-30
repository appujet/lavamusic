<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Lavamusic&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>
<br>
<h2 align="center">Our Music Bot</h2>
<h4 align="center">High Quality Music Bot with a DJ System, Music Channel Setup, 24/7 in VC, Stage Channels, Slash Commands Support and more for FREE!</h4>
<p align="center">
<a href="https://top.gg/bot/977742811132743762">
  <img src="https://top.gg/api/widget/977742811132743762.svg">
</a>
<br />
<br />
<br />

[![Version][version-shield]](version-url)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![Run on Repl.it](https://repl.it/badge/github/brblacky/lavamusic)](https://repl.it/github/brblacky/lavamusic)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/brblacky/lavamusic)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/876035356460462090/887728792926290091/20210820_124325.png" alt="Pbot-plus" width="200" height="200">
  </a>

  <h3 align="center">lavamusic</h3>

  <p align="center">
    Lavamusic is a powerful music Bot
    <br />
    <br />
    <a href="https://moebot.xyz/invite/">Invite Moe</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Request Feature</a>
  </p>
</p>

## 📝 Tutorial

A Tutorial has been uploaded on YouTube, Watch it by clicking [here](https://youtu.be/x5lQD2rguz0)

## 🎭 Features

- ✅ Setup System
- ✅ Music
- ✅ 24/7
- ✅ Dj
- ✅ Custom Playlist (global)
- ✅ SlashCommand
- ✅ Custom prefix
- ✅ Filters
- ✅ Easy to use
- ✅ And much more!

## 🖼️ Screenshots

<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://user-images.githubusercontent.com/50886682/196234856-1c80302f-eb5c-4687-9b1d-1e6d365fde3f.png">
    <img src="https://user-images.githubusercontent.com/50886682/196235575-27d0c2b2-cbe0-462b-b2b9-e04df329a4dc.png">
    <img src="https://user-images.githubusercontent.com/50886682/196235487-9b1cb8b6-9c1d-4a8e-b000-5d1435fcd6eb.png">
    <img src="https://user-images.githubusercontent.com/50886682/196235372-1844f0ce-3f86-45b9-9931-b225a53f3c80.png">

  </a>
</p>

## 📎 Requirements

- [Nodejs](https://nodejs.org/en/) v18 and more
- [Discord.js](https://github.com/discordjs/discord.js/) v14
- [Java](https://adoptopenjdk.net/) for lavalink
- [Lavalink](https://ci.fredboat.com/repository/download/Lavalink_Build/.lastSuccessful/Lavalink.jar?guest=1&branch=refs/heads/dev)

Note: Java v11 or newer is required to run the Lavalink.jar. Java v13 is recommended. If you are using sdkman then its a manager, not Java, you have to install sdkman and use sdkman to install Java

Warning: Java v14 has issues with Lavalink.

### 🌐 Main

- Discord bot's
  token `You should know why you need this or you won't go to this repo` [Get or create bot here](https://discord.com/developers/applications)
- Mongodb
  URI `for custom prefix` [MongoDB](https://account.mongodb.com/account/login)
- Your ID `for eval command. It's dangerous if eval accessible to everyone`
- Spotify client ID `for spotify support` [Click here to get](https://developer.spotify.com/dashboard/login)
- Spotify client Secret `for spotify support` [Click here to get](https://developer.spotify.com/dashboard/login)

## 🎶 Available music sources

- ✅ YouTube
- ✅ Bandcamp
- ✅ SoundCloud
- ✅ Twitch
- ✅ Vimeo
- ✅ http (you can use radio for it)
- ✅ Spotify
- ✅ Deezer

<!-- INSTALL -->

## 🚀 Installation using docker-compose

This section assumes you have docker and docker-compose installed and is running correctly.

Download the [Docker-Compose file](https://raw.githubusercontent.com/brblacky/lavamusic/main/docker-compose.yml) in a seperate folder like lavamusic.

Edit the Docker-Compose file and make sure to edit the following variables:

```yaml
TOKEN: "put your bot token"
PREFIX: "your bot prefix"
OWNER_ID: "your discord id"
```

For more information how to fill all the varialabes go to this page.
You do not need to edit anything like the PORT, ADDRESS, PASSWORD, HOST, SECURE and USERNAME. Unless you know what your doing.

After saving your changes you can open a terminal and go to the same location as the docker-compose file. Then type the following:

```bash
docker-compose up -d
```

The above command will start all your services and your bot should be up and running!

To update, you only have to type the following:

```bash
docker-compose up --force-recreate --build -d
image prune -f
```

You can automate this by using [Watchtower](https://github.com/containrrr/watchtower). The following should be sufficient:

```bash
docker run --detach \
    --name watchtower \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --restart on-failure \
    containrrr/watchtower --cleanup
```

Do note that the bot will restart itself to update to the latest!

## 🚀 Installation from source

```bash
git clone https://github.com/brblacky/lavamusic.git
```

After cloning, run

```bash
npm install
```

- Start the bot with `node src/sharder.js`

to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing _much_ easier.

## Intents

<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/848492641585725450/894114853382410260/unknown.png">

  </a>
</p>
When you are running the Code you must have gotten this Error. To fix this head over to your Bot's Discord Application and go to the Bot Settings and find this:

<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://user-images.githubusercontent.com/50886682/196232974-d9cfc18c-92c5-43bd-b1bc-ff1cae3df701.png">

  </a>
</p>
Then turn on both of those Settings and click "Save Changes". Then you are done and it should be fixed!
<!-- CONFIGURATION -->

## ⚙️ Configurations

- edit in `src/config.js` and you can do in `.env`

```js
    token: process.env.TOKEN || "",  // your bot token
    clientID: process.env.CLIENT_ID || "", // your bot client id
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNER_ID || "", //your discord id
    SpotifyID: process.env.SPOTIFY_ID || "",
    SpotifySecret: process.env.SPOTIFY_SECRET || "",
    mongourl: process.env.MONGO_URL || "", // MongoDb URL
    embedColor: process.env.EMBED_COLOR || 0x303236, // embed colour
    logs: process.env.LOGS || "channel_id", // channel id for guild create and delete logs
    errorLogsChannel: process.env.ERROR_LOGS_CHANNEL || "channel_id", //error logs channel id
    SearchPlatform: process.env.SEARCH_PLATFORM || "youtube music", // Sets the Search Platform. Possibilities: youtube || youtube music || soundcloud
```

## 🌋 Lavalink

```js
      "host": "localhost",
      "port": 2333,
      "password": "coders",
      "retryDelay": 3000,
      "secure": false
```

- Create an application.yml file in your working directory and copy the [example](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example) into the created file and edit it with your configuration.
- Run the jar file by running `java -jar Lavalink.jar` in a Terminal window.

## ⚙️ SHARDS

- edit in `sharder.js`

```js
  respawn: true,
  autoSpawn: true,
  token: token,
  totalShards: 1,
  shardList: "auto",
```

<!-- ABOUT THE PROJECT -->

## 🌀 About

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=brblacky&repo=lavamusic&theme=tokyonight)](https://github.com/brblacky/lavamusic)

Lavamusic is a lavalink music bot base in [erela.js](https://github.com/MenuDocs/erela.js)
If you liked this repository, feel free to leave a star ⭐ to help promote !

## 💌 Support Server

[![DiscordBanner](https://invidget.switchblade.xyz/ns8CTk9J3e)](https://discord.gg/ns8CTk9J3e)<br />
[Support Server](https://discord.gg/ns8CTk9J3e) - lavamusic's Support Server Invite

# Donate

By donating, you will help me to maintain this Project!

- [PayPal](https://www.paypal.me/sdip521)

## 🤝 Contributing

1. [Fork the repository](https://github.com/brblacky/lavamusic/fork)
2. Clone your fork: `git clone https://github.com/your-username/lavamusic.git`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Stage changes `git add .`
5. Commit your changes: `cz` OR `npm run commit` do not use `git commit`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

<!-- LICENSE -->

## 🔐 License

Distributed under the Apache-2.0 license License. See [`LICENSE`](https://github.com/brblacky/lavamusic/blob/master/LICENSE) for more information.

[version-shield]: https://img.shields.io/github/package-json/v/brblacky/lavamusic?style=for-the-badge
[version-url]: https://github.com/brblacky/lavamusic
[contributors-shield]: https://img.shields.io/github/contributors/brblacky/lavamusic.svg?style=for-the-badge
[contributors-url]: https://github.com/brblacky/lavamusic/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/brblacky/lavamusic.svg?style=for-the-badge
[forks-url]: https://github.com/brblacky/lavamusic/network/members
[stars-shield]: https://img.shields.io/github/stars/brblacky/lavamusic.svg?style=for-the-badge
[stars-url]: https://github.com/brblacky/lavamusic/stargazers
[issues-shield]: https://img.shields.io/github/issues/brblacky/lavamusic.svg?style=for-the-badge
[issues-url]: https://github.com/brblacky/lavamusic/issues
[license-shield]: https://img.shields.io/github/license/brblacky/lavamusic.svg?style=for-the-badge
[license-url]: https://github.com/brblacky/lavamusic/blob/master/LICENSE
[spon-img]: https://media.discordapp.net/attachments/979364157541462066/982734017671606322/Vultr_Logo_Download_Vector.png
