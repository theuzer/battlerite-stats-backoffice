const sql = require('mssql');
const mongoose = require('mongoose');

const dataConfig = {
  server: process.env.DB_DATA_SERVER || "testserver-handledata.database.windows.net",
  database: process.env.DB_DATA_DATABASE || "Data",
  user: process.env.DB_DATA_USERNAME || "david",
  password: process.env.DB_DATA_PASSWORD || "Admin123",
  port: 1433,
  options: { encrypt: true },
};

const dataConnection = new sql.ConnectionPool(dataConfig);

const mongoUser = process.env.DB_USERNAME || "admin";
const mongoPass = process.env.DB_PASSWORD || "admin";
const mongoHost = process.env.DB_HOST || "ds237748.mlab.com";
const mongoPort = process.env.DB_PORT || "37748";
const mongoName = process.env.DB_NAME || "battlerite-stats-backoffice";

const dbURI = `mongodb://${encodeURIComponent(mongoUser)}:${encodeURIComponent(mongoPass)}@${mongoHost}:${mongoPort}/${mongoName}`;
mongoose.connect(dbURI);
mongoose.connection.on('error', (err) => {
  if (err) {
    console.log(err);
  }
});

exports.mongoose = mongoose;
exports.dataConnection = dataConnection;
