const multisort = require("multisort");

const validPlatforms = ["youtube music", "youtube", "soundcloud"];

class SearchQuery {
    constructor(platform, query) {
        this.source = platform,
        this.query = query
    }
}

function isUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

function loadPlatforms(client) {
    const {SearchPlatform, AggregatedSearchOrder} = client.config;

        const searchPlatforms = [];
        if(AggregatedSearchOrder) {
            let platforms = AggregatedSearchOrder.split(',');
            platforms.forEach(platform => {
                platform = platform.trim();
                if(validPlatforms.includes(platform) && !searchPlatforms.includes(platform)) {
                    searchPlatforms.push(platform);
                }
            });            
        }
        if(searchPlatforms.length == 0) searchPlatforms.push(SearchPlatform.trim());

        return searchPlatforms;
}

module.exports = {    

    AggregatedSearchSuggestions: async function(client, query, requester)
    {
        const sortCriteria = [
            "author", //ASC   //DESC = "~name"
            "name"
        ]

        if(isUrl(query)) {
            const result = await client.manager.search(query, requester);
            const searchSuggestions = result.tracks.slice(0, 5);
            return result.loadType === "TRACK_LOADED" || "SEARCH_RESULT" ? searchSuggestions.map(track => ({
                name: `${track.title} – ${track.author}`.slice(0,100),
                value: query
              })) : false;
        }

        const searchPlatforms = loadPlatforms(client);
        const searchTasks = [];

        searchPlatforms.forEach(platform => {
            let searchQuery = new SearchQuery(platform, query);
            searchTasks.push(client.manager.search(searchQuery, requester));
        });

        const searchResults = await Promise.all(searchTasks);
        let searchSuggestions = [];

        for(i = 0; i < searchPlatforms.length; i++ )
        {
            if(!(searchResults[i].loadType  === "TRACK_LOADED" || "SEARCH_RESULT")) continue;

            const platformBadge = client.emoji[searchPlatforms[i]];
            let platformSuggestions = searchResults[i].tracks.slice(0, 4);
            platformSuggestions = multisort(platformSuggestions, sortCriteria);
            
            searchSuggestions = searchSuggestions.concat(
                    platformSuggestions.map(track => ({
                        name: `${platformBadge}${track.title} – ${track.author}`.slice(0,100),
                        value: track.uri
                    }))
            );
        }
        // Workaround: SoundCloud and its excessively long URL is breaking AutoComplete
        return searchSuggestions.length > 0 ? searchSuggestions.filter(item => item.value.length < 100) : false;

    }
}