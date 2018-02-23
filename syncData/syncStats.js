const sql = require('mssql');
const ontime = require('ontime');

const dataConnection = require('../database/index').dataConnection;
const logController = require('../controllers/logController');
const statsController = require('../controllers/statsController');
const statsDetailController = require('../controllers/statsDetailController');
const utils = require('../common/utils');
const constants = require('../common/constants');

const filterStats2 = (recordSet, teamSize, isRanked) => recordSet.filter(x => x.TeamSize === teamSize && x.IsRanked === isRanked);

const map = (obj, stat) => (obj !== 'undefined' && obj.length !== 0 ? obj[0][stat] : 0);

const getChampionStats2 = (records) => {
  const wins = records.filter(x => x.Win === true);
  const losses = records.filter(x => x.Win === false);
  return {
    wins: map(wins, 'GamesCount'),
    losses: map(losses, 'GamesCount'),
    gamesCount: map(wins, 'GamesCount') + map(losses, 'GamesCount'),
    roundsCount: map(wins, 'RoundsCount') + map(losses, 'RoundsCount'),
    abilityUses: map(wins, 'AbilityUses') + map(losses, 'AbilityUses'),
    damageDone: map(wins, 'DamageDone') + map(losses, 'DamageDone'),
    damageReceived: map(wins, 'DamageReceived') + map(losses, 'DamageReceived'),
    deaths: map(wins, 'Deaths') + map(losses, 'Deaths'),
    disablesDone: map(wins, 'DisablesDone') + map(losses, 'DisablesDone'),
    disablesReceived: map(wins, 'DisablesReceived') + map(losses, 'DisablesReceived'),
    energyGained: map(wins, 'EnergyGained') + map(losses, 'EnergyGained'),
    energyUsed: map(wins, 'EnergyUsed') + map(losses, 'EnergyUsed'),
    healingDone: map(wins, 'HealingDone') + map(losses, 'HealingDone'),
    healingReceived: map(wins, 'HealingReceived') + map(losses, 'HealingReceived'),
    kills: map(wins, 'Kills') + map(losses, 'Kills'),
    score: map(wins, 'Score') + map(losses, 'Score'),
    timeAlive: map(wins, 'TimeAlive') + map(losses, 'TimeAlive'),
  }; // divide this by 1)rounds count for average per round 2)games count for average per game
};

const processChampion = (recordSet, logId, league, champion) => {
  const duoRanked = filterStats2(recordSet, 2, true);
  const duoNormal = filterStats2(recordSet, 2, false);
  const trioRanked = filterStats2(recordSet, 3, true);
  const trioNormal = filterStats2(recordSet, 3, false);

  const trioRankedStats = getChampionStats2(trioRanked);
  const duoRankedStats = getChampionStats2(duoRanked);
  const duoNormalStats = getChampionStats2(duoNormal);
  const trioNormalStats = getChampionStats2(trioNormal);

  const stats = {
    championCode: champion.championCode,
    league: league,
  };

  statsController.createOrUpdateStats(stats, logId)
    .then((doc) => {
      statsDetailController.createOrUpdateStatsDetail(trioRankedStats, doc._id, constants.statsType.trioRanked);
      statsDetailController.createOrUpdateStatsDetail(duoRankedStats, doc._id, constants.statsType.duoRanked);
      statsDetailController.createOrUpdateStatsDetail(duoNormalStats, doc._id, constants.statsType.duoNormal);
      statsDetailController.createOrUpdateStatsDetail(trioNormalStats, doc._id, constants.statsType.trioNormal);
    })
    .catch((err) => {
      console.log(6, err);
    });
};

const processLeague2 = (recordSet, logId, league) => {
  const championList = utils.getChampionList(recordSet);

  championList.forEach((champion) => {
    const championRecords = recordSet.filter(x => x.ChampionCode === champion.championCode);
    processChampion(championRecords, logId, league, champion);
  });
};

const processResponse2 = (recordSet, logId) => {
  const leagueList = utils.getLeagueList(recordSet);

  leagueList.forEach((league) => {
    const leagueRecords = recordSet.filter(x => x.League === league);
    processLeague2(leagueRecords, logId, league);
  });
};

const insertStats = (query, logId) => {
  return new Promise((resolve, reject) => {
    console.log(query);
    new sql.Request(dataConnection).query(query)
      .then((response) => {
        console.log(`process response ${query}`);
        processResponse(response.recordset, logId);
        logController.updateLog(logId);
        resolve();
      })
      .catch((err) => {
        if (err.code === 'EREQUEST') {
          console.log(err);
          reject();
        } else if (err.code === 'ETIMEOUT') {
          console.log(5, query);
          setTimeout(() => {
            insertStats(query, logId);
          }, 60000);
        }
      });
  });
};

const initializeLog = (logType, year, month, day) => {
  return new Promise((resolve, reject) => {
    const query = utils.getChampionStatsQuery(logType, year, month, day);

    logController.checkIfExists(logType)
      .then((log) => {
        if (log === null) {
          logController.createLog(logType)
            .then((logId) => {
              insertStats(query, logId)
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            });
        } else {
          insertStats(query, log._id)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        }
      })
      .catch((err) => {
        reject();
        console.log(1, logType, err);
      });
  });
};

const syncData = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();

  initializeLog(constants.logType.yesterday, year, month, day)
    .then(() => {
      initializeLog(constants.logType.lastWeek, year, month, day)
        .then(() => {
          initializeLog(constants.logType.lastMonth, year, month, day)
            .then(() => {
              initializeLog(constants.logType.allTime, year, month, day);
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

const filterStats = (recordSet, teamSize, isRanked, league) => recordSet.filter(x => x.TeamSize === teamSize && x.IsRanked === isRanked && x.League === league);

const getChampionStats = (championList, i, champion, category, statsList) => {
  const champ = statsList.filter(x => x.ChampionCode === champion.championCode);
  const wins = champ.filter(x => x.Win === true);
  const losses = champ.filter(x => x.Win === false);
  championList[i][category] = {
    wins: map(wins, 'GamesCount'),
    losses: map(losses, 'GamesCount'),
    gamesCount: map(wins, 'GamesCount') + map(losses, 'GamesCount'),
    roundsCount: map(wins, 'RoundsCount') + map(losses, 'RoundsCount'),
    abilityUses: map(wins, 'AbilityUses') + map(losses, 'AbilityUses'),
    damageDone: map(wins, 'DamageDone') + map(losses, 'DamageDone'),
    damageReceived: map(wins, 'DamageReceived') + map(losses, 'DamageReceived'),
    deaths: map(wins, 'Deaths') + map(losses, 'Deaths'),
    disablesDone: map(wins, 'DisablesDone') + map(losses, 'DisablesDone'),
    disablesReceived: map(wins, 'DisablesReceived') + map(losses, 'DisablesReceived'),
    energyGained: map(wins, 'EnergyGained') + map(losses, 'EnergyGained'),
    energyUsed: map(wins, 'EnergyUsed') + map(losses, 'EnergyUsed'),
    healingDone: map(wins, 'HealingDone') + map(losses, 'HealingDone'),
    healingReceived: map(wins, 'HealingReceived') + map(losses, 'HealingReceived'),
    kills: map(wins, 'Kills') + map(losses, 'Kills'),
    score: map(wins, 'Score') + map(losses, 'Score'),
    timeAlive: map(wins, 'TimeAlive') + map(losses, 'TimeAlive'),
  };
};

const processLeague = (recordSet, logId, champList, league) => {
  const duoRanked = filterStats(recordSet, 2, true, league);
  const duoNormal = filterStats(recordSet, 2, false, league);
  const trioRanked = filterStats(recordSet, 3, true, league);
  const trioNormal = filterStats(recordSet, 3, false, league);

  champList.forEach((champ, i) => {
    getChampionStats(champList, i, champ, 'duoRanked', duoRanked, league);
    getChampionStats(champList, i, champ, 'duoNormal', duoNormal, league);
    getChampionStats(champList, i, champ, 'trioRanked', trioRanked, league);
    getChampionStats(champList, i, champ, 'trioNormal', trioNormal, league);
    champ.league = league;
  });

  console.log(champList);

  champList.forEach((champ) => {
    statsController.createOrUpdateStats(champ, logId);
  });
};

const processResponse = (recordSet, logId) => {
  const champList = utils.getChampionList(recordSet);
  const leagueList = utils.getLeagueList(recordSet);

  leagueList.forEach((league) => {
    processLeague(recordSet, logId, JSON.parse(JSON.stringify(champList)), league);
  });
};

module.exports = {
  syncData,
};
