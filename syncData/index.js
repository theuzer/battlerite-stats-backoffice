const constants = require('../common/constants');
const syncStats = require('./syncStats');
const syncPlayers = require('./syncPlayers');

exports.initializeDb = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();

  syncStats.initializeLog(constants.logType.yesterday, year, month, day);
  setTimeout(syncStats.initializeLog(constants.logType.lastWeek, year, month, day), 60000);
  setTimeout(syncStats.initializeLog(constants.logType.lastMonth, year, month, day), 120000);
  setTimeout(syncStats.initializeLog(constants.logType.allTime, year, month, day), 180000);

  syncPlayers.initializeLog();
};

exports.syncData = () => {

};
