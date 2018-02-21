const Log = require('../models/log');

exports.createLog = (type) => {
  return new Promise((resolve, reject) => {
    const newLog = new Log();
    newLog.type = type;

    newLog.save((err, log) => {
      if (err) {
        reject(err);
      }
      resolve(log._id);
    });
  });
};

exports.checkIfExists = (type) => {
  return new Promise((resolve, reject) => {
    Log.findOne({ type })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.updateLog = (logId) => {
  Log.update({ _id: logId }, { date_created: Date.now() }, (err) => {
    if (err) {
      throw err;
    }
  });
};
