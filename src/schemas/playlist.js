import pkg from 'mongoose';
const { Schema, model } = pkg;

let Playlist = new Schema({
    Username: {
        type: String,
        required: false
    },
    UserId: {
        type: String,
        required: true
    },
    PlaylistName: {
        type: String,
        required: true
    },
    Playlist: {
        type: Array,
        required: true
    },
    CreatedOn: {
        type: Number,
        required: true
    }

});

export default model('playlist', Playlist);