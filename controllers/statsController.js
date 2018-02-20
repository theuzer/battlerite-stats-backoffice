const Stats = require('../models/stats');

exports.createStats = (stats, logId) => {
  const newStats = new Stats();
  newStats.championCode = stats.championCode;
  newStats.league = stats.league;
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

exports.createOrUpdateStats = (stats, logId) => {
  Stats.update(
    { log: logId, championCode: stats.championCode, league: stats.league },
    {
      log: logId,
      championCode: stats.championCode,
      league: stats.league,
      duoRanked: stats.duoRanked,
      duoNormal: stats.duoNormal,
      trioRanked: stats.trioRanked,
      trioNormal: stats.trioNormal,
    },
    { upsert: true },
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
};
