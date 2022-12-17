import pkg from 'mongoose';
const { Schema, model } = pkg;

let Setup = new Schema({
    _id: String,
    Channel: String,
    Message: String,
})

export default model('Setup', Setup);