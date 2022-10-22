const { get } = require("node-superfetch");
const cheerio = require("cheerio");

const DeezerShareLinkRegex = /^((?:https?:)\/\/)?((?:deezer)\.)?((?:page.link))\/([a-zA-Z0-9]+)/;

module.exports = {    

    Preprocess: async function(url)
    {
        if(DeezerShareLinkRegex.test(url)) {
            const { body } = await get(url);
            $ = cheerio.load(body);
            let trackUri = $('meta[property="og:url"]').attr('content');
            return trackUri;
        }
        else return url;

    }
}