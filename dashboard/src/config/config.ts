/* eslint-disable import/no-anonymous-default-export */

export default {
    api: {
        base: "http://localhost:3001/api",
    },
    menuList: [
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Contact", href: "/contact" },
    ],
    logo: "https://media.discordapp.net/attachments/876035356460462090/887728792926290091/20210820_124325.png",
    links: {
        invite: "https://discord.com/api/oauth2/authorize?client_id=876035356460462090&permissions=8&scope=bot%20applications.commands",
    }
}