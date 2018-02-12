const mongoose = require('mongoose');

const Stats = require('../models/stats');
const Log = require('../models/log');

exports.createStats = (stats, logId) => {
  const newStats = new Stats();
  newStats.championCode = stats.championCode;
  newStats.duoRanked = stats.duoRanked;
  newStats.duoNormal = stats.duoNormal;
  newStats.trioRanked = stats.trioRanked;
  newStats.trioNormal = stats.trioNormal;
  newStats.log = logId;

  newStats.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.getStatsByDate = (req, res) => {
  Log.findOne({ year: req.query.year, month: req.query.month, day: req.query.day }).exec()
    .then((log) => {
      Stats.find({ log: mongoose.Types.ObjectId(log._id) }).exec()
        .then((stats) => {
          res.json(stats);
        });
    });
};

exports.getStatsByLogId = (req, res) => {
  Stats.find({ log: mongoose.Types.ObjectId(req.query.id) })
    .then((response) => {
      console.log(response);
    });
};
