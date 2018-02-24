const Stats = require('../models/stats');

exports.createOrUpdateStatsImproved = (timePeriod, league, mode, isRanked, championCode, stats, championName) => {
  Stats.update(
    {
      timePeriod,
      league,
      mode,
      isRanked,
      championCode,
    },
    {
      dateUpdated: Date.now(),
      timePeriod,
      league,
      mode,
      isRanked,
      championCode,
      championName,
      stats,
    },
    { upsert: true },
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
};
