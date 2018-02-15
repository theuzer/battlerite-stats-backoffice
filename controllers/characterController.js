const sql = require('mssql');

const queries = require('../common/queries');
const dataConnection = require('../database/index').dataConnection;

exports.getCharacterHistory = (req, res) => {
  // validate req ?

  if (!req.query.page) {
    req.query.page = '0';
  }

  new sql.Request(dataConnection).query(queries.getCharacterHistory(req.query.playerId, req.query.page))
    .then((response) => {
      res.json(response.recordset);
    })
    .catch((err) => {
      res.json(err);
    });
};
