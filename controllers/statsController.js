const mongoose = require('mongoose');
const iniparser = require('iniparser');

const Stats = require('../models/stats');
const Log = require('../models/log');
const gameplay = require('../static/assets/gameplay.json');

const english = iniparser.parseSync('./static/assets/English.ini');

const getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

const handleMatchType = (matchType) => {
  return {
    wins: matchType.wins,
    losses: matchType.losses,
    totalGames: matchType.wins + matchType.losses,
    winRate: matchType.wins / (matchType.wins + matchType.losses),
  };
};

const handleGetStatsByDate = (dataIn) => {
  return dataIn.map((record) => {
    return {
      championName: getChampionName(record.championCode),
      trioRanked: handleMatchType(record.trioRanked),
      duoRanked: handleMatchType(record.duoRanked),
      trioNormal: handleMatchType(record.trioNormal),
      duoNormal: handleMatchType(record.duoNormal),
    };
  });
};

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
          const dataOut = handleGetStatsByDate(stats);
          res.json(dataOut);
        });
    });
};

exports.getStatsByLogId = (req, res) => {
  Stats.find({ log: mongoose.Types.ObjectId(req.query.id) })
    .then((response) => {
      console.log(response);
    });
};
