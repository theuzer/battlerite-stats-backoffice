const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogSchema = new Schema({
  year: Number,
  month: Number,
  day: Number,
});

module.exports = mongoose.model('Log', LogSchema);

