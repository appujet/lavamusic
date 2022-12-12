import pkg from 'mongoose';
const { Schema, model } = pkg;

let Setup = new Schema({
    Guild: String,
    Channel: String,
    Message: String,
    voiceChannel: String,
})

export default model('Setup', Setup);