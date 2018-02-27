const sql = require('mssql');
const axios = require('axios');
const ontime = require('ontime');

const dataConnection = require('../database/index').dataConnection;
const queries = require('../common/queries');
const constants = require('../common/constants');
const playerController = require('../controllers/playerController');

const getHeader = key => ({ headers: { Authorization: key, Accept: constants.api.accept } });
const playerCodesQueue = [];

const processPlayerCodes = (playerCodes) => {
  playerCodes.forEach((playerCode) => {
    playerController.checkIfPlayerExists(playerCode.playerCode)
      .then((exists) => {
        if (exists) {
          new sql.Request(dataConnection).query(queries.updatePlayerProcessed(playerCode.playerCode))
            .then(() => {
              console.log(`Updated existing player. ID: ${playerCode.playerCode}.`);
            })
            .catch((err) => {
              console.log(err.code);
            });
        } else {
          playerCodesQueue.push(playerCode.playerCode);
        }
      });
  });
};

const doWork = (key, i) => {
  if (i < 10) {
    const playerCode = playerCodesQueue.shift();
    playerController.checkIfPlayerExists(playerCode)
      .then((exists) => {
        if (!exists) {
          const url = constants.api.playerUrl(playerCode);
          const header = getHeader(key);
          axios.get(url, header)
            .then((response) => {
              playerController.createPlayer(playerCode, response.data.data.attributes.name);
              console.log(`Created player. ID: ${playerCode} and Name: ${response.data.data.attributes.name}.`);
              doWork(key, i + 1);
            })
            .catch((err) => {
              console.log(err);
              playerCodesQueue.push(playerCode);
            });
        } else {
          doWork(key, i + 1);
        }
      })
      .catch((err) => {
        console.log(err);
        playerCodesQueue.push(playerCode);
      });
  }
};

const initializeLog = () => {
  console.log('Retrieving players: Start.');
  console.time('RetrievingPlayers');
  new sql.Request(dataConnection).query(queries.getDistinctPlayers(parseInt(process.env.NUMBER_OF_PLAYERS, 10)))
    .then((response) => {
      console.log(`Retrieving players: End. Got ${response.recordset.length} results.`);
      console.timeEnd('RetrievingPlayers');
      processPlayerCodes(response.recordset);
    })
    .catch((err) => {
      console.log(err.code);
      console.timeEnd('RetrievingPlayers');
    });
};

ontime({
  cycle: ['0'],
}, (ot) => {
  initializeLog();
  if (playerCodesQueue.length !== 0) {
    console.log(`Sync queue has ${playerCodesQueue.length} players.`);
    const keys = [constants.api.keys.key1, constants.api.keys.key2, constants.api.keys.key3, constants.api.keys.key4, constants.api.keys.key5];
    for (let i = 0; i < keys.length; i++) {
      doWork(keys[i], 0);
    }
  }
  ot.done();
});
