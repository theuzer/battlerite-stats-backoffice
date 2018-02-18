const express = require('express');
const path = require('path');
const ontime = require('ontime');
const https = require('https');

const routes = require('./routes/index');
const syncData = require('./syncData/index');
const dataConnection = require('./database/index').dataConnection;
require('./database/index');

const port = 3000; // || process.env.PORT

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
  console.log('a');
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

// KEEP APP AWAKE
if (process.env.HEROKU_TIMER_CREATE === 'TRUE') {
  setInterval(() => {
    https.get(process.env.HEROKU_APP_URL);
    console.log('Pinged application');
  }, parseInt(process.env.HEROKU_APP_TIMER, 10));
}

dataConnection.connect()
  .then(() => {
    console.log('data connected');
    syncData.initializeDb();
  })
  .catch((err) => {
    console.log(err);
  });

ontime({
  cycle: ['00:00:00'],
}, (ot) => {
  syncData.syncData();
  ot.done();
});
