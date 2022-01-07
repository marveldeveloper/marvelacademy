'use strict';
const logger = require('../startup/logging').logger;
const { errMsg } = require('../tools/message');

module.exports = (req, res, next) => {
  logger.debug(
    `path: ${req.method + req.path}\n\tbody: ${JSON.stringify(
      req.body
    )}\n\tquery: ${JSON.stringify(req.query)}\n\tparams${JSON.stringify(
      req.params
    )}\n\n\t`
  );

  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  next();
};
