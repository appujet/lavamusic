const _fetch = require('node-fetch');

/**
 * Fetch data from Anilist
 * @param {String} query graphql query to search with
 * @param {Object} variables variables to include in the search
 * @returns {Promise<data>} fetch result
 */
function fetch(query, variables){
  return _fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query, variables })
  })
  .then(res => res.json())
  .catch(err => err);
};

module.exports = { fetch };
