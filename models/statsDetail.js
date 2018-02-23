const mongoose = require('mongoose');

const constants = require('../common/constants');

const Schema = mongoose.Schema;

const StatsDetailSchema = new Schema({
  type: {
    type: String,
    enum: [constants.statsType.duoNormal, constants.statsType.duoRanked, constants.statsType.trioNormal, constants.statsType.trioRanked],
  },
  statsId: {
    type: Schema.Types.ObjectId,
    ref: 'Stats',
  },
  wins: Number,
  losses: Number,
  gamesCount: Number,
  roundsCount: Number,
  abilityUses: Number,
  damageDone: Number,
  damageReceived: Number,
  deaths: Number,
  disablesDone: Number,
  disablesReceived: Number,
  energyGained: Number,
  energyUsed: Number,
  healingDone: Number,
  healingReceived: Number,
  kills: Number,
  score: Number,
  timeAlive: Number,
});

module.exports = mongoose.model('StatsDetail', StatsDetailSchema);

