const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  playerCode: String,
  playerName: String,
  playerNameLower: {
    type: String,
    index: { unique: true },
  },
});

module.exports = mongoose.model('Player', PlayerSchema);
