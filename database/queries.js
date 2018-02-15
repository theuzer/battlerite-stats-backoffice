const constants = require('../models/constants');

const getChampionWinrateByDate = (year, month, day) => `select * from champion_winrate_date where year=${year} and month=${month} and day=${day}`;
const getCharacterHistory = (playerCode, page) => `select * from get_character_history_page('${playerCode}', ${page});`;

const championWinrateAllTime = `championWinrate${constants.logType.allTime}`;

module.exports = {
  getSynergies: "select count(*), ch1.championCode, ch2.championCode, g.win from gameteam g, match m, character c1, character c2, champion ch1, champion ch2 where g.matchId = m.id   and c1.gameteamid = g.id   and c2.gameteamid = g.id   and c1.championId = ch1.id   and c2.championId = ch2.id   and m.teamSize = 2   and m.isRanked = 1   and c1.championId <> c2.championId group by ch2.championCode, ch1.championCode, g.win order by ch2.championCode, win",
  [championWinrateAllTime]: "select * from ChampionWinrate_AllTime",
  getChampionWinrateByDate,
  getCharacterHistory,
  championWinrate: "championWinrate",
};
