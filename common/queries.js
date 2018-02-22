const getChampionWinrateAllTime = "select * from ChampionWinrate_AllTime";
const getChampionWinrateLastMonth = (year, month, day) => `select * from ChampionWinrate_LastMonth('${year}/${month}/${day} 00:00:00')`;
const getChampionWinrateLastWeek = (year, month, day) => `select * from ChampionWinrate_LastWeek('${year}/${month}/${day} 00:00:00')`;
const getChampionWinrateYesterday = (year, month, day) => `select * from ChampionWinrate_Yesterday('${year}/${month}/${day} 00:00:00')`;

module.exports = {
  getSynergies: "select count(*), ch1.championCode, ch2.championCode, g.win from gameteam g, match m, character c1, character c2, champion ch1, champion ch2 where g.matchId = m.id   and c1.gameteamid = g.id   and c2.gameteamid = g.id   and c1.championId = ch1.id   and c2.championId = ch2.id   and m.teamSize = 2   and m.isRanked = 1   and c1.championId <> c2.championId group by ch2.championCode, ch1.championCode, g.win order by ch2.championCode, win",
  getChampionWinrateAllTime,
  getChampionWinrateLastMonth,
  getChampionWinrateLastWeek,
  getChampionWinrateYesterday,
  getDistinctPlayers: "select distinct top 600 playerCode from character where isPlayerProcessed = 0",
  updatePlayerProcessed: playerCode => `update character set isPlayerProcessed = 1 where playerCode = ${playerCode}`,
};
