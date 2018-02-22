const constants = require('../common/constants');
const syncStats = require('./syncStats');
const syncPlayers = require('./syncPlayers');

exports.initializeDb = () => {
  const currDate = new Date();
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();

  // syncPlayers.initializeLog();

  /*
  syncStats.initializeLog(constants.logType.yesterday, year, month, day)
    .then(() => {
      syncStats.initializeLog(constants.logType.lastWeek, year, month, day)
        .then(() => {
          syncStats.initializeLog(constants.logType.lastMonth, year, month, day)
            .then(() => {
              syncStats.initializeLog(constants.logType.allTime, year, month, day)
                .then(() => {
                  syncPlayers.initializeLog();
                });
            });
        });
    });

    */
};

exports.syncData = () => {

};
