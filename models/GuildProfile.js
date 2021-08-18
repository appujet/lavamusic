const { model, Schema } = require('mongoose');

module.exports = model('server_profiles', Schema({
  _id: String,
  prefix: { type: String, default: null },
  greeter: {
    welcome: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      message: { type: String, default: null },
      embed: { type: Object, default: false },
      type: { type: String, default: 'default' }
    },
    leaving: {
      isEnabled: { type: Boolean, default: false },
      channel: { type: String, default: null },
      message: { type: String, default: null },
      embed: { type: Object, default: null },
      type: { type: String, default: 'default' }
    },
    autorole: {
      role: { type: Boolean, default: false},
      
    }
  },
  xp: {
    isActive: { type: Boolean, default: false },
    exceptions: { type: Array, default: []}
  },
  roles: {
    muted: { type: String, default: null }
  },
  channels: {
    suggest: { type: String, default: null }
  }
}, {
  versionKey: false
}));
