const Log = require('../models/log');

exports.createLog = (year, month, day) => {
  return new Promise((resolve, reject) => {
    const newLog = new Log();
    newLog.year = year;
    newLog.month = month;
    newLog.day = day;

    newLog.save((err, log) => {
      if (err) {
        reject(err);
      }
      resolve(log._id);
    });
  });
};
