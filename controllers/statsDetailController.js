const StatsDetail = require('../models/statsDetail');

exports.createStatsDetail = (statsDetail, statsId, type) => {
  const newStatsDetail = new StatsDetail();
  newStatsDetail.stats = statsId;
  newStatsDetail.type = type;
  newStatsDetail.wins = statsDetail.wins;
  newStatsDetail.losses = statsDetail.losses;
  newStatsDetail.gamesCount = statsDetail.gamesCount;
  newStatsDetail.roundsCount = statsDetail.roundsCount;
  newStatsDetail.abilityUses = statsDetail.abilityUses;
  newStatsDetail.damageDone = statsDetail.damageDone;
  newStatsDetail.damageReceived = statsDetail.damageReceived;
  newStatsDetail.deaths = statsDetail.deaths;
  newStatsDetail.disablesDone = statsDetail.disablesDone;
  newStatsDetail.disablesReceived = statsDetail.disablesReceived;
  newStatsDetail.energyGained = statsDetail.energyGained;
  newStatsDetail.energyUsed = statsDetail.energyUsed;
  newStatsDetail.healingDone = statsDetail.healingDone;
  newStatsDetail.healingReceived = statsDetail.healingReceived;
  newStatsDetail.kills = statsDetail.kills;
  newStatsDetail.score = statsDetail.score;
  newStatsDetail.timeAlive = statsDetail.timeAlive;

  newStatsDetail.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.createOrUpdateStats = (statsDetail, statsId, type) => {
  StatsDetail.update(
    { stats: statsId, type },
    {
      stats: statsId,
      type,
      wins: statsDetail.wins,
      losses: statsDetail.losses,
      gamesCount: statsDetail.gamesCount,
      roundsCount: statsDetail.roundsCount,
      abilityUses: statsDetail.abilityUses,
      damageDone: statsDetail.damageDone,
      damageReceived: statsDetail.damageReceived,
      deaths: statsDetail.deaths,
      disablesDone: statsDetail.disablesDone,
      disablesReceived: statsDetail.disablesReceived,
      energyGained: statsDetail.energyGained,
      energyUsed: statsDetail.energyUsed,
      healingDone: statsDetail.healingDone,
      healingReceived: statsDetail.healingReceived,
      kills: statsDetail.kills,
      score: statsDetail.score,
      timeAlive: statsDetail.timeAlive,
    },
    { upsert: true },
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
};
