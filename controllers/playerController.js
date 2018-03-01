const Player = require('../models/player');

exports.checkIfPlayerExists = (playerCode) => {
  return new Promise((resolve, reject) => {
    Player.findOne({ playerCode }).exec()
      .then((player) => {
        if (player !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.createPlayer = (playerCode, playerName) => {
  const newPlayer = new Player();
  newPlayer.playerCode = playerCode;
  newPlayer.playerName = playerName;
  newPlayer.playerNameLower = playerName.toLowerCase();

  newPlayer.save((err) => {
    if (err) {
      throw err;
    }
  });
};

exports.getAllPlayers = () => {
  return new Promise((resolve, reject) => {
    Player.find().exec()
      .then((players) => {
        resolve(players);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

