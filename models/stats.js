const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatsSchema = new Schema({
  championCode: Number,
  league: Number,
  log: {
    type: Schema.Types.ObjectId,
    ref: 'Log',
  },
});

module.exports = mongoose.model('Stats', StatsSchema);

