const { model, Schema } = require('mongoose');

module.exports = model('user_profiles', Schema({
  _id: String,
  data: {
    global_xp: {type: Number, default: 0},
    global_level: {type: Number, default: 1},
    profile: {
      bio: {type: String, default: 'No bio written.'},
      background: {type: String, default: null},
      pattern: {type: String, default: null},
      emblem: {type: String, default: null},
      hat: {type: String, default: null},
      wreath: {type: String, default: null},
      color: {type: String, default: null},
      birthday: {type: String, default: null},
      inventory: {type: Array, default: []}
    },
    economy: {
      bank: {type: Number, default: null},
      wallet: {type: Number, default: null},
      streak: {
        alltime: {type: Number, default: 0},
        current: {type: Number, default: 0},
        timestamp: {type: Number, default: 0}
      },
      shard: {type: Number, default: null}
    },
    tips: {
      given: {type: Number, default: 0},
      received: {type: Number, default: 0},
      timestamp: {type: Number, default: 0}
    },
    xp: {type: Array, default: []},
    vote: {
      notification: { type: Boolean, default: true }
    }
  }
},{
  versionKey: false
}));
