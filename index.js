const express = require('express');
const path = require('path');
const sql = require('mssql');
const iniparser = require('iniparser');
const ontime = require('ontime');
const moment = require('moment');

//const dataConnection = require('./database/index').dataConnection;
const queries = require('./database/queries');
const gameplay = require('./static/assets/gameplay.json');
const logController = require('./controllers/logController');
const statsController = require('./controllers/statsController');
const routes = require('./routes/stats');
require('./database/index');

const english = iniparser.parseSync('./static/assets/English.ini');

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

const dataConfig = {
  server: "testserver-handledata.database.windows.net",
  database: "Data",
  user: "david",
  password: "Admin123",
  port: 1433,
  options: { encrypt: true },
};

const dataConnection = new sql.ConnectionPool(dataConfig);

const filterByTeamSizeAndRanked = (recordSet, teamSize, isRanked) => recordSet.filter(x => x.teamsize === teamSize && x.isranked === isRanked);
const getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

const getChampionList = (recordSet) => {
  const champList = [];
  recordSet.forEach((record) => {
    if (!champList.some(x => x.championCode === record.championcode)) {
      champList.push({
        championCode: record.championcode,
        championName: getChampionName(record.championcode),
      });
    }
  });
  return champList;
};

const getChampionStats = (championList, i, champion, category, statsList) => {
  const champ = statsList.filter(x => x.championcode === champion.championCode);
  const victories = champ.filter(x => x.win === true)[0].count;
  const losses = champ.filter(x => x.win === false)[0].count;
  championList[i][category] = {
    wins: victories,
    losses,
  };
};

const processResponse = (recordSet, year, month, day) => {
  const champList = getChampionList(recordSet);
  const duo_ranked = filterByTeamSizeAndRanked(recordSet, 2, true);
  const duo_normal = recordSet.filter(x => x.teamsize === 2 && x.isranked === false);
  const trio_ranked = recordSet.filter(x => x.teamsize === 3 && x.isranked === true);
  const trio_normal = recordSet.filter(x => x.teamsize === 3 && x.isranked === false);

  champList.forEach((champ, i) => {
    getChampionStats(champList, i, champ, 'duoRanked', duo_ranked);
    getChampionStats(champList, i, champ, 'duoNormal', duo_normal);
    getChampionStats(champList, i, champ, 'trioRanked', trio_ranked);
    getChampionStats(champList, i, champ, 'trioNormal', trio_normal);
  });

  logController.createLog(year, month, day)
    .then((logId) => {
      champList.forEach((champ) => {
        statsController.createStats(champ, logId);
      });
    });
};

dataConnection.connect()
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
  console.log('a');
});

app.use('/api', routes);

ontime({
  cycle: ['00:01:00'],
}, (ot) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  new sql.Request(dataConnection).query(queries.getChampionWinrateByDate(year, month, day))
    .then((response) => {
      processResponse(response.recordset, year, month, day);
    })
    .catch((err) => {
      console.log(err);
    });
  ot.done();
});
