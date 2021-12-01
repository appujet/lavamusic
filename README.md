[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fbrblacky%2Flavamusic&envs=COlOR%2CLOGS%2CMONGO_URI%2COWNERID%2CPREFIX%2CSPOTIFYID%2CSPOTIFYSECRET%2CTOKEN&optionalEnvs=COlOR%2COWNERID&COlORDesc=embed+colour+code+hex&LOGSDesc=Channel+I%27d&MONGO_URIDesc=Your+Mongo+url&OWNERIDDesc=your+discord+id&PREFIXDesc=your+bot+prefix&SPOTIFYIDDesc=Spotify+client+id&SPOTIFYSECRETDesc=Spotify+client+secret&TOKENDesc=Your+bot%27s+bot+token.&COlORDefault=%23303236&PREFIXDefault=%21&referralCode=kcnA8M)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/brblacky/lavamusic)
[![Run on Repl.it](https://repl.it/badge/github/brblacky/lavamusic)](https://repl.it/github/brblacky/lavamusic)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/import/github/brblacky/lavamusic)


[![Version][version-shield]](version-url)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=lavamusic&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/876035356460462090/887728792926290091/20210820_124325.png" alt="Pbot-plus" width="200" height="200">
  </a>

  <h3 align="center">lavamusic</h3>

  <p align="center">
    Lavamusic is  a powerful music Bot
    <br />
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=892268662487121970&permissions=536870911991&redirect_uri=https%3A%2F%2Fdiscord.gg%2FjN8AKsPcwu&response_type=code&scope=guilds.join%20bot%20applications.commands">Invite Lavamusic</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Request Feature</a>
  </p>
</p>


## 📝 Tutorial

A Tutorial has been uploaded on YouTube, Watch it by clicking [here](https://youtu.be/x5lQD2rguz0)


## 🎭 Features

- [x] Music
- [x] 24/7
- [x] custom prefix
- [x] filters
- [x] More


## 🖼️ Screenshots
<br />
<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/876035356460462090/912404827118641202/Screenshot_20211122-234019__01.jpg">
    <img src="https://media.discordapp.net/attachments/876035356460462090/910856250084970518/Screenshot_20211118-170634__01.jpg">
    <img src="https://media.discordapp.net/attachments/876035356460462090/910855739969527849/Screenshot_20211118-170456__01.jpg">
    <img src="https://media.discordapp.net/attachments/876035356460462090/911442921738350622/Screenshot_20211120-075640__01.jpg">

  </a>
</p>

## 📎 Requirements
* [Nodejs](https://nodejs.org/en/)-v16 
* [Discord.js](https://github.com/discordjs/discord.js/)-v13
* [Java](https://adoptopenjdk.net/) for lavalink
* [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1)

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

## 🎶 Available music sources:

- youtube`*`
- bandcamp`*`
- soundcloud`*`
- twitch`*`
- vimeo`*`
- http (you can use radio for it)`*`
- spotify`*`
- deezer`*`


<!-- INSTALL -->
## 🚀 Installation
```
git clone https://github.com/brblacky/lavamusic.git
```
After cloning, run an
```
npm install
```
* Start the bot with `node index.js`

to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing *much* easier.

## intents

<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/848492641585725450/894114853382410260/unknown.png">

  </a>
</p>
When Your Running The Code You Must Have Gotten This Error To Fix This Head Over To Your Bots Discord Application and Go To The Bot Settings And Find This

<p align="center">
  <a href="https://github.com/brblacky/lavamusic">
    <img src="https://media.discordapp.net/attachments/848492641585725450/894115221701001216/unknown.png">

  </a>
</p>
Then Turn On Both Of Those Settings And Click "Save Changes" Then Your Are Done And The It Should Be Fixed
<!-- CONFIGURATION -->

## ⚙️ Configurations

     "TOKEN": "", //Discord bot token 
     "MONGOURL": "",  //MongoDb url
     "KSOFT_API_KEY": "",  //ksoft api
     "PREFIX": "!",  //Default prefix
     "OWNERID": "491577179495333903",  //Owner id
     "SpotifyID": "",  //spotify client ID
     "SpotifySecret": "", //spotify client secret
     "embedColor": "",  //default embed color
    
## 🌋 lavalink 

      "host": "disbotlistlavalink.ml",
      "port": 443,
      "password": "LAVA",
      "retryDelay": 3000,
      "secure": true

- Create an application.yml file in your working directory and copy the [example](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example) into the created file and edit it with your configuration.
- Run the jar file by running `java -jar Lavalink.jar` in a Terminal window.


<!-- ABOUT THE PROJECT -->

## 🌀 About
[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=brblacky&repo=lavamusic&theme=tokyonight)](https://github.com/brblacky/lavamusic)

 Lavamusic is a lavalink music bot base in [erela.js](https://github.com/MenuDocs/erela.js)
If you liked this repository, feel free to leave a star ⭐ to help promote !

## 💌 Support Server
[![DiscordBanner](https://invidget.switchblade.xyz/gfcv94hDhv)](https://discord.gg/gfcv94hDhv)
[Support Server](https://discord.gg/gfcv94hDhv) - lavamusic's Support Server Invite


<!-- LICENSE -->

## 🔐 License

Distributed under the MIT License. See [`LICENSE`](https://github.com/brblacky/lavamusic/blob/master/LICENSE) for more information.

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
