const constants = require('../common/constants');
const syncStats = require('./syncStats');
const syncPlayers = require('./syncPlayers');

const delayLog = (logType, year, month, day, delayInSeconds) =>
  setInterval(() => {
    syncStats.initializeLog(logType, year, month, day);
  }, delayInSeconds * 1000);

exports.initializeDb = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();

  syncStats.initializeLog(constants.logType.yesterday, year, month, day);
  delayLog(constants.logType.lastWeek, year, month, day, 60);
  delayLog(constants.logType.lastMonth, year, month, day, 120);
  delayLog(constants.logType.allTime, year, month, day, 180);

  syncPlayers.initializeLog();
};

exports.syncData = () => {

};
