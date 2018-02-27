const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatsSchema = new Schema({
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
  timePeriod: {
    type: String,
    enum: [0, 1, 2, 3],
  },
  league: {
    type: Number,
    enum: [null, 0, 1, 2, 3, 4, 5, 6, 7],
  },
  mode: {
    type: Number,
    enum: [null, 2, 3],
  },
  isRanked: {
    type: Boolean,
    enum: [null, true, false],
  },
  championCode: Number,
  championName: String,
  championIcon: String,
  championSubname: String,
  stats: {
    wins: Number,
    losses: Number,
    winRate: Number,
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
  },
});

module.exports = mongoose.model('Stats', StatsSchema);

