const sql = require('mssql');
const mongoose = require('mongoose');

const dataConfig = {
  server: process.env.DB_DATA_SERVER,
  database: process.env.DB_DATA_DATABASE,
  user: process.env.DB_DATA_USERNAME,
  password: process.env.DB_DATA_PASSWORD,
  port: 1433,
  options: { encrypt: true },
};

const dataConnection = new sql.ConnectionPool(dataConfig);

const dbURI = `mongodb://${encodeURIComponent(process.env.DB_USERNAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(dbURI);
mongoose.connection.on('error', (err) => {
  if (err) {
    console.log(err);
  }
});

exports.mongoose = mongoose;
exports.dataConnection = dataConnection;
