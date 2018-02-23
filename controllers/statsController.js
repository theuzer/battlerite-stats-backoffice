const Stats = require('../models/stats');

exports.createStats = (stats, logId) => {
  const newStats = new Stats();
  newStats.championCode = stats.championCode;
  newStats.league = stats.league;
  newStats.log = logId;

  newStats.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.createOrUpdateStats = (stats, logId) => {
  return new Promise((resolve, reject) => {
    Stats.findOneAndUpdate(
      { log: logId, championCode: stats.championCode, league: stats.league },
      {
        log: logId,
        championCode: stats.championCode,
        league: stats.league,
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      },
    );
  });
};
