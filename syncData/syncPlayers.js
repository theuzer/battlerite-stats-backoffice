const sql = require('mssql');
const axios = require('axios');

const dataConnection = require('../database/index').dataConnection;
const queries = require('../common/queries');
const constants = require('../common/constants');
const playerController = require('../controllers/playerController');

const getHeader = key => ({ headers: { Authorization: key, Accept: constants.api.accept } });
let playerCodesQueue;

const processPlayerCodes = (playerCodes) => {
  playerController.getAllPlayers()
    .then((existingPlayers) => {
      playerCodes = playerCodes.map(player => player.playerCode);
      existingPlayers = existingPlayers.map(existingPlayer => existingPlayer.playerCode);
      playerCodesQueue = playerCodes.filter(x => existingPlayers.indexOf(x) === -1);
    })
    .catch((err) => {
      console.log(err);
    });
};

const doWork = (key, i) => {
  if (i < 10) {
    const playerCode = playerCodesQueue.shift();
    console.log(playerCode);
    playerController.checkIfPlayerExists(playerCode)
      .then((exists) => {
        if (!exists) {
          const url = constants.api.playerUrl(playerCode);
          const header = getHeader(key);
          axios.get(url, header)
            .then((response) => {
              playerController.createPlayer(playerCode, response.data.data.attributes.name);
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

exports.initializeLog = () => {
  console.time('getDistinctPlayers');
  new sql.Request(dataConnection).query(queries.getDistinctPlayers)
    .then((response) => {
      console.timeEnd('getDistinctPlayers');
      processPlayerCodes(response.recordset);
    })
    .catch((err) => {
      console.log(err.code);
    });
};

setInterval(() => {
  console.log('do work');
  if (playerCodesQueue.length !== 0) {
    console.log('length', playerCodesQueue.length);
    const keys = [constants.api.keys.key1, constants.api.keys.key2, constants.api.keys.key3, constants.api.keys.key4, constants.api.keys.key5];
    for (let i = 0; i < keys.length; i++) {
      doWork(keys[i], 0);
    }
  }
}, 60000);
