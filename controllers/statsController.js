const mongoose = require('mongoose');

const Stats = require('../models/stats');
const Log = require('../models/log');
const utils = require('./utils');

const noResultsFound = {
  response: 'no results found',
};

const handleMatchType = matchType => ({
  wins: matchType.wins,
  losses: matchType.losses,
  totalGames: matchType.wins + matchType.losses,
  winRate: matchType.wins / (matchType.wins + matchType.losses),
});

const handleGetStatsByDate = dataIn => (dataIn.map(record => ({
  championName: utils.getChampionName(record.championCode),
  trioRanked: handleMatchType(record.trioRanked),
  duoRanked: handleMatchType(record.duoRanked),
  trioNormal: handleMatchType(record.trioNormal),
  duoNormal: handleMatchType(record.duoNormal),
})));

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
      if (log !== null) {
        Stats.find({ log: mongoose.Types.ObjectId(log._id) }).exec()
          .then((stats) => {
            const dataOut = handleGetStatsByDate(stats);
            res.json(dataOut);
          });
      } else {
        res.json(noResultsFound);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStatsByLogId = (req, res) => {
  Stats.find({ log: mongoose.Types.ObjectId(req.query.id) })
    .then((response) => {
      console.log(response);
      res.json(response);
    });
};
