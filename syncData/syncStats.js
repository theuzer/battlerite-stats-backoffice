const sql = require('mssql');
const ontime = require('ontime');

const dataConnection = require('../database/index').dataConnection;
const logController = require('../controllers/logController');
const statsController = require('../controllers/statsController');
const utils = require('../common/utils');
const constants = require('../common/constants');

const map = (obj, stat) => (obj !== 'undefined' && obj.length !== 0 ? obj[0][stat] : 0);
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
