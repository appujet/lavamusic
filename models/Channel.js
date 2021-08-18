const mongoose = require("mongoose");

const channelSchema = mongoose.Schema({
  _id: String,
  channel_id: String,
  mode: Boolean
});

module.exports = mongoose.model("24/7_VC", channelSchema);
