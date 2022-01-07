'use strict';

const { errMsg } = require('../tools/message');
const { getUserFromToken } = require('../tools/auth');

module.exports = async (req, res, next) => {
  let user = await getUserFromToken(req.header('x-auth-token'));
  if (!user) return errMsg(req, res, 'authenticationFailed');
  req.user = user;
  next();
};
