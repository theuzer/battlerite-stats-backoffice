const sql = require('mssql');
const ontime = require('ontime');

const dataConnection = require('../database/index').dataConnection;
const utils = require('../common/utils');
const statsController = require('../controllers/statsController');

const processChampion = (championSet, timePeriod, mode, league, isRanked, champion) => {
  const stats = championSet.reduce((a, b) =>
    ({
      gamesCount: a.gamesCount + b.GamesCount,
      roundsCount: a.roundsCount + b.RoundsCount,
      abilityUses: a.abilityUses + b.AbilityUses,
      damageDone: a.damageDone + b.DamageDone,
      damageReceived: a.damageReceived + b.DamageReceived,
      deaths: a.deaths + b.Deaths,
      disablesDone: a.disablesDone + b.DisablesDone,
      disablesReceived: a.disablesReceived + b.DisablesReceived,
      energyGained: a.energyGained + b.EnergyGained,
      energyUsed: a.energyUsed + b.EnergyUsed,
      healingDone: a.healingDone + b.HealingDone,
      healingReceived: a.healingReceived + b.HealingReceived,
      kills: a.kills + b.Kills,
      score: a.score + b.Score,
      timeAlive: a.timeAlive + b.TimeAlive,
    }), {
    gamesCount: 0,
    roundsCount: 0,
    abilityUses: 0,
    damageDone: 0,
    damageReceived: 0,
    deaths: 0,
    disablesDone: 0,
    disablesReceived: 0,
    energyGained: 0,
    energyUsed: 0,
    healingDone: 0,
    healingReceived: 0,
    kills: 0,
    score: 0,
    timeAlive: 0,
  });

  const wins = championSet.filter(x => x.Win === true).reduce((a, b) => a + b.GamesCount, 0);
  const losses = championSet.filter(x => x.Win === false).reduce((a, b) => a + b.GamesCount, 0);

  stats.wins = wins;
  stats.losses = losses;
  stats.winRate = stats.gamesCount === 0 ? 0 : wins / stats.gamesCount;

  statsController.createOrUpdateStatsImproved(timePeriod, league, mode, isRanked, champion, stats);
};

const processStats = (recordSet, timePeriod, mode, league, isRanked, champList) => {
  if (mode !== null) {
    recordSet = recordSet.filter(x => x.TeamSize === mode);
  }
  if (league !== null) {
    recordSet = recordSet.filter(x => x.League === league);
  }
  if (isRanked !== null) {
    recordSet = recordSet.filter(x => x.IsRanked === isRanked);
  }

  champList.forEach((champion) => {
    const championSet = recordSet.filter(x => x.ChampionCode === champion.championCode);
    processChampion(championSet, timePeriod, mode, league, isRanked, champion);
  });
};

const processResponse = (recordSet, timePeriod) => {
  const champList = utils.getChampionList(recordSet);
  const modes = [null, 2, 3];
  const leagues = [null, 0, 1, 2, 3, 4, 5, 6];
  const isRanked = [null, true, false];

  for (let i = 0; i < modes.length; i++) {
    for (let j = 0; j < leagues.length; j++) {
      for (let k = 0; k < isRanked.length; k++) {
        processStats(recordSet, timePeriod, modes[i], leagues[j], isRanked[k], champList);
      }
    }
  }
};

const insertStats = (query, timePeriod) => {
  return new Promise((resolve, reject) => {
    console.log(query);
    new sql.Request(dataConnection).query(query)
      .then((response) => {
        console.log(`process response ${query}`);
        processResponse(response.recordset, timePeriod);
        resolve();
      })
      .catch((err) => {
        if (err.code === 'EREQUEST') {
          console.log(5, err);
          reject();
        } else if (err.code === 'ETIMEOUT') {
          console.log(6, query);
          setTimeout(() => {
            insertStats(query, timePeriod);
          }, 60000);
        }
      });
  });
};

const initializeLog = (timePeriod, year, month, day) => {
  return new Promise((resolve, reject) => {
    const query = utils.getChampionStatsQuery(timePeriod, year, month, day);

    insertStats(query, timePeriod)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

const syncData = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();

  initializeLog(3, year, month, day)
    .then(() => {
      initializeLog(2, year, month, day)
        .then(() => {
          initializeLog(1, year, month, day)
            .then(() => {
              initializeLog(0, year, month, day);
            });
        });
    });
};

ontime({
  cycle: ['00:00:00'],
}, (ot) => {
  syncData();
  ot.done();
});

module.exports = {
  syncData,
};
