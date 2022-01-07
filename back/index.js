const c = require('config');
const logger = require('./startup/logging').logger;
const express = require('express');
const mongoUtil = require('./startup/mongoUtil');

const app = express();
app.use(express.json());
require('express-async-errors');
require('./startup/cors')(app);
require('./startup/sanetizeMongo')(app);
require('./startup/helmet')(app);

const address = process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0';
const port = process.env.PORT || c.get('port');

const server = app.listen(port, address, () => {
  logger.info(`Listening on port ${port}...`);
  process.send('ready');
});

mongoUtil.connectToServer((err) => {
  if (err) logger.error(`Error connecting to db: ${err}`);
  else {
    logger.info(`Connected to mongodb://${c.get('mongAddress')}:${c.get('mongPort')}...`);
    require('./startup/routes')(app);
  }
});

module.exports = server;
