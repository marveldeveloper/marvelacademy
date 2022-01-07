'use strict';
const logger = require('../startup/logging').logger;
const { errMsg } = require('../tools/message');

module.exports = (err, req, res, next) => {
  logger.error(
    `path: ${req.path}\n\tbody: ${JSON.stringify(req.body)}\n\tquery: ${JSON.stringify(
      req.query
    )}\n\tparams${JSON.stringify(req.params)}\n\terror: ${err}`
  );

  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  return errMsg(req, res, 'internalServerError');
};
