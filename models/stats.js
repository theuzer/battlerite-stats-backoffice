const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatsSchema = new Schema({
  championCode: Number,
  league: Number,
  duoRanked: {
    wins: Number,
    losses: Number,
  },
  duoNormal: {
    wins: Number,
    losses: Number,
  },
  trioRanked: {
    wins: Number,
    losses: Number,
  },
  trioNormal: {
    wins: Number,
    losses: Number,
  },
  log: {
    type: Schema.Types.ObjectId,
    ref: 'Log',
  },
});

module.exports = mongoose.model('Stats', StatsSchema);

