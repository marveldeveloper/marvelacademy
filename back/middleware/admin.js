'use strict';

const { errMsg } = require('../tools/message');
module.exports = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super')
    return errMsg(req, res, 'accessDenied');

  next();
};
