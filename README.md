

<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Lavamusic&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>

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
    <a href="https://discord.com/api/oauth2/authorize?client_id=875635121770889257&permissions=8&scope=bot%20applications.commands">Invite Lavamusic</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Request Feature</a>
  </p>
</p>


## 🎭 Features

- ✅ Music
- ✅ Prefix

## 🎶 Support Sources

- ✅ YouTube
- ✅ SoundCloud
- ✅ Twitch
- ✅ Bandcamp
- ✅ Vimeo
- ✅ Https (Radio)
<details><summary>More source(s)</summary>

**Plugins (Require: LavaLink v3.6.x)**

- [x] [LavaSrc](https://github.com/TopiSenpai/LavaSrc)
- Spotify
- Deezer
- Apple
- Yandex

- [x] [skybot-lavalink-plugin](https://github.com/DuncteBot/skybot-lavalink-plugin)
- Mixcloud
- Ocremix
- Clyp
- Reddit
- Getyarn
- TikTok
- PornHub
- Soundgasm

- **Need Help with plugins?** Join our [Discord Server](https://discord.gg/ns8CTk9J3e) and ask in the `#support` channel.

</details>

## 📚 Commands

<details><summary>Click to expand</summary>

| Name | Description |
|------|-------------|
| prefix | Shows the bot's prefix |
|      | Options     |
|      |-------------|
|      | prefix: The prefix you want to set |
| about | Shows information about the bot |
|      | None        |
| help | Shows the help menu |
|      | Options     |
|      |-------------|
|      | command: The command you want to get info on |
| info | Ingormation about the bot |
|      | None        |
| invite | Sends the bot's invite link |
|      | None        |
| ping | Shows the bot's ping |
|      | None        |
| clearqueue | Clears the queue |
|      | None        |
| join | Joins the voice channel |
|      | None        |
| leave | Leaves the voice channel |
|      | None        |
| nowplaying | Shows the currently playing song |
|      | None        |
| play | Plays a song from YouTube or Spotify |
|      | Options     |
|      |-------------|
|      | song: The song you want to play |
| pause | Pauses the current song |
|      | None        |
| queue | Shows the current queue |
|      | None        |
| remove | Removes a song from the queue |
|      | Options     |
|      |-------------|
|      | song: The song number |
| resume | Resumes the current song |
|      | None        |
| seek | Seeks to a certain time in the song |
|      | None        |
| shuffle | Shuffles the queue |
|      | None        |
| skip | Skips the current song |
|      | None        |
| skipto | Skips to a specific song in the queue |
|      | None        |
| stop | Stops the music and clears the queue |
|      | None        |
| volume | Sets the volume of the player |
|      | Options     |
|      |-------------|
|      | number: The volume you want to set |


</details>

## 📥 Installation guide

Lavamusic is a Discord music bot that uses Discord.js, Shoukaku, Prisma Client (ORM) database (MongoDB), and TypeScript.

## 🔧 Requirements

Before starting with the installation, you need to have the following:

- Node.js (v18.x or higher)
- A Discord bot token
- A MongoDB database
- A Lavalink server (for audio playback)

## 📝 Setup

1. Clone the Lavamusic repository:
  
  ```bash
  git clone  https://github.com/brblacky/lavamusic.git
```
2. change the directory to Lavamusic
```bash
cd lavamusic
```
3. Install the required packages:

```bash
npm install
```

4. Set up your environment variables:

Create a `.env` file in the root directory of your project with the following variables:
  
  ```bash
  TOKEN="." # Your bot token
PREFIX="!" # Your prefix
OWNER_IDS="859640640640640640, 859640640640640640" # Your ID
CLIENT_ID="960072976412340254" # Your bot client ID
GUILD_ID="859640640640640640" # Your server ID (if you want to use it for a single server)
PRODUCTION="true" # "true" for production
DATABASE_URL="mongodb+srv://Blacky:xxxxxxxxxxxx" # Your MongoDB URL
LAVALINK_URL="localhost:2333" # Your Lavalink URL
LAVALINK_AUTH="youshallnotpass" # Your Lavalink password
LAVALINK_NAME="Blacky" # Your Lavalink name
LAVALINK_SECURE="false" # "true" for secure Lavalink
```
5. Generate the Prisma client:
**If you using replit than read this:** 

go to `prisma/schema.prisma` and add engine type like this `engineType = "binary"` and then run this command
  
  ```bash
  npx prisma generate
```

6. Run the bot:
  
  ```bash
  npm run start of npm start
```

7. Invite the bot to your server:

Generate an invite link for your bot and invite it to your server using the Discord Developer Portal.

## 🔗 Useful Links

- [Discord.js](https://discord.js.org/)
- [Shoukaku](https://shoukaku.js.org/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Lavalink](https://github.com/freyacodes/Lavalink)


## 📝 Tutorial

A Tutorial has been uploaded on YouTube, Watch it by clicking [here](https://youtu.be/x5lQD2rguz0)

## 📜 Contributing

Thank you for your interest in contributing to Lavamusic! Here are some guidelines to follow when contributing:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Write clean and concise code that follows the established coding style.
3. Create detailed and thorough documentation for any new features or changes.
4. Write and run tests for your code.
5. Submit a pull request with your changes.

Your contribution will be reviewed by the project maintainers, and any necessary feedback or changes will be discussed with you. We appreciate your help in making Lavamusic better!

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
