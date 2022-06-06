const { Schema, model} = require('mongoose');

let Setup = new Schema({
    Guild : String,
    Channel: String,
    Message: String,
    voiceChannel: String,
})

module.exports = model('Setup', Setup);