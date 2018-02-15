const mongoose = require('mongoose');

const constants = require('../common/constants');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  date_created: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: [constants.logType.unfiltered, constants.logType.allTime, constants.logType.lastMonth, constants.logType.lastWeek, constants.logType.yesterday],
  },
});

module.exports = mongoose.model('Log', LogSchema);

