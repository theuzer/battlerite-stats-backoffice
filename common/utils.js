const iniparser = require('iniparser');

const gameplay = require('../static/assets/gameplay.json');
const constants = require('./constants');
const queries = require('./queries');

const english = iniparser.parseSync('./static/assets/English.ini');

exports.getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

exports.getChampionWinrateQuery = (logType, year, month, day) => {
  switch (logType) {
    case constants.logType.allTime:
      return queries.getChampionWinrateAllTime;
    case constants.logType.lastMonth:
      return queries.getChampionWinrateLastMonth(year, month, day);
    case constants.logType.lastWeek:
      return queries.getChampionWinrateLastWeek(year, month, day);
    case constants.logType.yesterday:
      return queries.getChampionWinrateYesterday(year, month, day);
    default:
      return queries.getChampionWinrateAllTime;
  }
};
