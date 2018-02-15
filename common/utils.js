const iniparser = require('iniparser');

const gameplay = require('../static/assets/gameplay.json');
const constants = require('./constants');
const queries = require('./queries');

const english = iniparser.parseSync('./static/assets/English.ini');

exports.getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

exports.getChampionListArray = (dataIn) => {
  return dataIn.map(x => x.championCode)
    .filter((value, index, self) => self.indexOf(value) === index);
};

exports.getChampionList = (dataIn) => {
  const championList = dataIn.map(x => x.championCode)
    .filter((value, index, self) => self.indexOf(value) === index);
  for (let i = 0; i < championList.length; i++) {
    championList[i] = { championCode: championList[i] };
  }
  return championList;
};

exports.getTimePeriodFilter = (timePeriodFilter) => {
  switch (timePeriodFilter) {
    case '0':
      return constants.logType.allTime;
    case '1':
      return constants.logType.lastMonth;
    case '2':
      return constants.logType.lastWeek;
    case '3':
      return constants.logType.yesterday;
    default:
      return constants.logType.allTime;
  }
};

exports.getRankedFilter = (ranked) => {
  switch (ranked) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return null;
  }
};

exports.getLeagueFilter = (league) => {
  switch (league) {
    case '0':
      return 0;
    case '1':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    default:
      return null;
  }
};

exports.getModeFilter = (mode) => {
  switch (mode) {
    case '2':
      return 2;
    case '3':
      return 3;
    default:
      return null;
  }
};

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
