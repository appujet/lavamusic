const {
    model,
    Schema
} = require("mongoose");

module.exports = model("setup-schema", new Schema({
    _id: {
        type: String,
        required: true
    },

    channel: {
        type: String,
        required: true
    },

    voiceChannel: {
        type: String,
        required: false,
        default: null
    }
}));