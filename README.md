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
    <img src="https://media.discordapp.net/attachments/845318824323448882/876690332333514752/1629089649835.png" alt="Pbot-plus" width="200" height="200">
  </a>

  <h3 align="center">lavamusic</h3>

  <p align="center">
    Lavamusic is  a powerful music Bot
    <br />
    <br />
    <a href="https://github.com/brblacky/lavamusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/brblacky/lavamusic/issues">Request Feature</a>
  </p>
</p>

## 🎭 Futures

- [x] Music
- [x] 24/7
- [x] custom prefix
- [x] filters
- [x] More


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
<!-- CONFIGURATION -->

## ⚙️ Configuration

    `"TOKEN": "",` //Discord bot token 
    `"MONGOURL": "",` //MongoDb url
    `"KSOFT_API_KEY": "",` //ksoft api
    `"PREFIX": "!",` //Default prefix
    `"OWNERID": "491577179495333903",` //Owner id
    `"clientID": "",` //spotify client ID
    `"clientSecret": "",` //spotify client secret
    `"embedColor": "",` //default embed color
    
## 🌋 lavalink 

      "host": "lavalink-repl.brblacky.repl.co",
      "port": 443,
      "password": "LAVA",
      "retryDelay": 3000,
      "secure": true
    

<!-- ABOUT THE PROJECT -->

## 🌀 About
 Lavamusic is a lavalink music bot base in erela.js 
If you liked this repository, feel free to leave a star ⭐ to help promote !

## 💌 Support Server
[![DiscordBanner](https://invidget.switchblade.xyz/uAVaeCP9VH)](https://discord.gg/uAVaeCP9VH)
[Support Server](https://discord.gg/uAVaeCP9VH) - Ali's Support Server Invite
:----:

#  Discord Bot with MongoDB

- Hello! Here is another tutorial in which you will learn how to use the mongodb database.

- First, let's download the project (you can do this by clicking on [me **lavamusic**](https://github.com/brblacky/lavamusic/archive/master.zip))

- Next, we need to create a server. This is the longest stage. So make some tea and sit down at the computer: 3

- If you have any questions/problems go to our [Discord Server](https://discord.gg/uAVaeCP9VH)

- Come on official MongoDB website. [Register](https://account.mongodb.com/account/register) or [Login](https://account.mongodb.com/account/login) into your account.

- After registration, you will be transferred to another page. You need to click on the green button, then write the name of your project in the window that opens (no matter what you write, this will not affect the work.) Click on the green button. Examples:

![](https://cdn.discordapp.com/attachments/667072123914813444/686353659650768939/IMG_20200309_035249.png)

![](https://cdn.discordapp.com/attachments/667072123914813444/686353659331870865/IMG_20200309_035651.png)

![](https://cdn.discordapp.com/attachments/667072123914813444/686353658962640904/IMG_20200309_035747.png)

- And so, we have created our project, now let's create a "cluster". Click on the **Build a Cluster** button, then in the window that opens, simply click the green **Create cluster** button (You can also change the name of the cluster if you wish, by default it is "Cluster0")

![](https://cdn.discordapp.com/attachments/667072123914813444/686353658648199200/IMG_20200309_035819.png)

![](https://cdn.discordapp.com/attachments/667072123914813444/686353658299809807/IMG_20200309_035851.png)

- After you clicked on the **Create cluster** button. You should wait 1-3 minutes.

![](https://cdn.discordapp.com/attachments/667072123914813444/686353627912208447/IMG_20200309_035925.png)

- After our cluster has been created, you will see this picture:

![](https://cdn.discordapp.com/attachments/667072123914813444/686353627736178702/IMG_20200309_040013.png)

- Okay! The floor is done. Next, go to the **Database Access** tab. Screenshot:

![](https://cdn.discordapp.com/attachments/667072123914813444/686353627509817527/IMG_20200309_040207.png)

- After switching to this tab, we see a green button with the inscription **ADD NEW USER**, in the window that opens, set the rights "Atlas Admin". Then write your name and the desired password (it is worthwhile to understand that through these data you will enter the database. So write down your password on a piece of paper or notebook.) Save! Screenshot:

![](https://cdn.discordapp.com/attachments/667072123914813444/686353627320680467/IMG_20200309_040424.png)

- Now. Go to the **Network Access** tab.

![](https://cdn.discordapp.com/attachments/667072123914813444/686353626209452081/IMG_20200309_042002.png)

- We see a green button with the inscription ***ADD IP ADDRESS***, poke. In the window that opens, in the line "**Whitelist Entry**", write the value ***0.0.0.0/0***. A comment is optional. We save.

![](https://cdn.discordapp.com/attachments/667072123914813444/686353627106902047/IMG_20200309_040548.png)

<br><br><br><br>

- [🎉] Congratulations! We have created a base, now we need a link to connect to the base. To do this, again go to the **Clusters** tab

![](https://cdn.discordapp.com/attachments/667072123914813444/686353626029228097/IMG_20200309_042035.png)


- We see our newly created cluster. We find a button labeled ***CONNECT***, press it. A window opens, click the second section ("Connect Your Application"). After that you will see the ***copy*** button (this link cannot be shown to people. If they find out the name and password from the database, they will be able to manage your database.). Copy the link and paste it into our code. config.json -> dataURL

![](https://cdn.discordapp.com/attachments/667072123914813444/686353626758905877/IMG_20200309_041447.png)

- Also, instead of `<password>`, write your password that you specified in the **Database Access** tab, creating a new user.
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
