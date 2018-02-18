const sql = require('mssql');

const dataConnection = require('../database/index').dataConnection;
const logController = require('../controllers/logController');
const statsController = require('../controllers/statsController');
const utils = require('../common/utils');

const filterStats = (recordSet, teamSize, isRanked, league) => recordSet.filter(x => x.teamsize === teamSize && x.isranked === isRanked && x.league === league);

const getChampionStats = (championList, i, champion, category, statsList) => {
  const champ = statsList.filter(x => x.championcode === champion.championCode);
  const victories = champ.filter(x => x.win === true);
  const losses = champ.filter(x => x.win === false);
  championList[i][category] = {
    wins: victories.length === 0 ? 0 : victories[0].count,
    losses: losses.length === 0 ? 0 : losses[0].count,
  };
};

const getChampionList = (recordSet) => {
  const champList = [];
  recordSet.forEach((record) => {
    if (!champList.some(x => x.championCode === record.championcode)) {
      champList.push({
        championCode: record.championcode,
        championName: utils.getChampionName(record.championcode),
      });
    }
  });
  return champList;
};

const getLeagueList = (recordSet) => {
  const leagueList = [];
  recordSet.forEach((record) => {
    if (!leagueList.some(x => x === record.league)) {
      leagueList.push(record.league);
    }
  });
  return leagueList;
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
  const champList = getChampionList(recordSet);
  const leagueList = getLeagueList(recordSet);

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

exports.initializeLog = (logType, year, month, day) => {
  return new Promise((resolve, reject) => {
    const query = utils.getChampionWinrateQuery(logType, year, month, day);

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
