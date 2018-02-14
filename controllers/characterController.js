const sql = require('mssql');

const queries = require('../database/queries');
const dataConnection = require('../database/index').dataConnection;

exports.getCharacterHistory = (req, res) => {
  // validate req ?

  new sql.Request(dataConnection).query(queries.getCharacterHistory(req.query.playerId))
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
};
