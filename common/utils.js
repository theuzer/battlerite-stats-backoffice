const iniparser = require('iniparser');

const gameplay = require('../static/assets/gameplay.json');
const queries = require('./queries');

const english = iniparser.parseSync('./static/assets/English.ini');

const getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];
const getChampionIcon = championCode => gameplay.characters.filter(x => x.typeID === championCode)[0].icon;
const getChampionSubname = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].title];

const getChampionStatsQuery = (timePeriod, year, month, day) => {
  switch (timePeriod) {
    case 0:
      return queries.getChampionStatsAllTime;
    case 1:
      return queries.getChampionStatsLastMonth(year, month, day);
    case 2:
      return queries.getChampionStatsLastWeek(year, month, day);
    case 3:
      return queries.getChampionStatsYesterday(year, month, day);
    default:
      return queries.getChampionStatsAllTime;
  }
};

const getChampionList = (recordSet) => {
  const champList = [];
  recordSet.forEach((record) => {
    if (!champList.some(x => x.championCode === record.ChampionCode)) {
      champList.push({
        championCode: record.ChampionCode,
        championName: getChampionName(record.ChampionCode),
        championIcon: getChampionIcon(record.ChampionCode),
        championSubname: getChampionSubname(record.ChampionCode),
      });
    }
  });
  return champList;
};

const getLeagueList = (recordSet) => {
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
  getChampionStatsQuery,
  getChampionList,
  getLeagueList,
};
