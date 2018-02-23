const sql = require('mssql');
const mongoose = require('mongoose');

const dataConfig = {
  server: process.env.DB_DATA_SERVER,
  database: process.env.DB_DATA_DATABASE,
  user: process.env.DB_DATA_USERNAME,
  password: process.env.DB_DATA_PASSWORD,
  port: 1433,
  options: { encrypt: true },
  requestTimeout: parseInt(process.env.DB_DATA_QUERY_TIMEOUT, 10),
};

const dataConnection = new sql.ConnectionPool(dataConfig);
dataConnection.connect()
  .then(() => {
    console.log('data connected');
  })
  .catch((err) => {
    console.log(err);
  });

const mongoUser = process.env.DB_USERNAME;
const mongoPass = process.env.DB_PASSWORD;
const mongoHost = process.env.DB_HOST;
const mongoPort = process.env.DB_PORT;
const mongoName = process.env.DB_NAME;

const dbURI = `mongodb://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPass)}@${mongoHost}:${mongoPort}/${mongoName}`;
mongoose.connect(dbURI);
mongoose.connection.on('error', (err) => {
  if (err) {
    console.log(err);
  }
});

exports.mongoose = mongoose;
exports.dataConnection = dataConnection;
