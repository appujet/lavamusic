const { Schema, model} = require('mongoose');

let Prefix = new Schema({
    Guild : String,
    Prefix : String, 
    oldPrefix: String,
})

module.exports = model('prefix', Prefix);