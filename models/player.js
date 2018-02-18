const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  playerCode: String,
  playerName: String,
});

module.exports = mongoose.model('Player', PlayerSchema);
