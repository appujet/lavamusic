const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, required: true},
  guildid: {type:String, required:true},
  prefix: {type:String, required:true, default: "."}
});

module.exports = mongoose.model("prefix", productSchema);
