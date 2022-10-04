const { Schema, model } = require("mongoose");

const twentyfourseven = new Schema({
  Guild: {
    type: String,
    required: true,
  },
  247: {
    type: Boolean,
    required: false,
  },
  VoiceChannel: {
    type: String,
    required: false,
  },
  TextChannel: {
    type: String,
    required: false,
  },
});
module.exports = model("247", twentyfourseven);
