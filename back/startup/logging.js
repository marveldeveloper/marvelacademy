'use strict';
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', //(info, debug) also 'debug' logs passwords in plain be careful! and run yarn build
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

process.on('unhandledRejection', (ex) => {
  throw ex;
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = {
  logger,
};
