import pkg from 'mongoose';
const { Schema, model } = pkg;

let Prefix = new Schema({
    _id : String,
    prefix : String, 
    oldPrefix: String,
})

export default model('prefix', Prefix);