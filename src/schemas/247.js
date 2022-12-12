import pkg from 'mongoose';
const { Schema, model } = pkg;

let twentyfourseven = new Schema({
    _id: {
        type: String,
        required: true,
    },
    _247: {
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
export default model("247", twentyfourseven);
