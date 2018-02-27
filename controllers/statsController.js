const Stats = require('../models/stats');

exports.createOrUpdateStatsImproved = (timePeriod, league, mode, isRanked, champion, stats) => {
  Stats.update(
    {
      timePeriod,
      league,
      mode,
      isRanked,
      championCode: champion.championCode,
    },
    {
      dateUpdated: Date.now(),
      timePeriod,
      league,
      mode,
      isRanked,
      championCode: champion.championCode,
      championName: champion.championName,
      championIcon: champion.championIcon,
      championSubname: champion.championSubname,
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
