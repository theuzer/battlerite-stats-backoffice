const iniparser = require('iniparser');

const gameplay = require('../static/assets/gameplay.json');
const constants = require('./constants');
const queries = require('./queries');

const english = iniparser.parseSync('./static/assets/English.ini');

const getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

exports.getChampionStatsQuery = (logType, year, month, day) => {
  switch (logType) {
    case constants.logType.allTime:
      return queries.getChampionStatsAllTime;
    case constants.logType.lastMonth:
      return queries.getChampionStatsLastMonth(year, month, day);
    case constants.logType.lastWeek:
      return queries.getChampionStatsLastWeek(year, month, day);
    case constants.logType.yesterday:
      return queries.getChampionStatsYesterday(year, month, day);
    default:
      return queries.getChampionStatsAllTime;
  }
};

exports.getChampionList = (recordSet) => {
  const champList = [];
  recordSet.forEach((record) => {
    if (!champList.some(x => x.championCode === record.ChampionCode)) {
      champList.push({
        championCode: record.ChampionCode,
        championName: getChampionName(record.ChampionCode),
      });
    }
  });
  return champList;
};

exports.getLeagueList = (recordSet) => {
  const leagueList = [];
  recordSet.forEach((record) => {
    if (!leagueList.some(x => x === record.League)) {
      leagueList.push(record.League);
    }
  });
  return leagueList;
};

module.exports = {
  getChampionName,
};
