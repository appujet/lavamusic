const { Schema, model} = require('mongoose');

let Dj = new Schema({
    Guild : {
        type: String,
        required: true
    },
    Roles : {
        type: Array,
        default: null
    }, 
    Mode: {
        type: Boolean,
        default: false
    },
})
module.exports = model('dj', Dj);