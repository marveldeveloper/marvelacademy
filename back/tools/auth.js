'use strict';
const c = require('config');
const jwt = require('jsonwebtoken');
const objectId = require('mongodb').ObjectId;

const mongo = require('../startup/mongoUtil');
const redis = require('../startup/redisClient');

const { randomString } = require('./random');

const collection = mongo.getCollection('user');

const generateAuthToken = async (_id, phone, role) => {
  let token = jwt.sign({ _id, phone, role }, c.get('jwtPrivateKey'));
  let previous_token = await redis.keys(`${token}*`);
  if (previous_token && previous_token.length) await redis.del(previous_token[0]);

  token += randomString(c.get('authTokenPostfixLength'));
  await collection.updateOne({ phone: phone }, { $set: { token: token } });
  await redis.set(token, 1, 'EX', c.get('authTokenExpireTime'));
  return token;
};

const logout = async (req, id) => {
  let user = await collection.findOne({ _id: new objectId(id) });
  await collection.updateOne({ _id: new objectId(id) }, { $unset: { token: '' } });
  await redis.del(user.token);
};

const getUserFromToken = async (token) => {
  if (!token) return null;
  const isValidToken = await redis.get(token);
  let user;
  if (isValidToken) {
    try {
      token = token.substring(0, token.length - c.get('authTokenPostfixLength'));
      user = jwt.verify(token, c.get('jwtPrivateKey'));
      return user;
    } catch (ex) {
      return null;
    }
  } else {
    user = await collection.findOne(
      { token: token },
      {
        _id: 1,
        phone: 1,
        role: 1,
      }
    );
    if (user && user.status !== 'active') {
      user._id = user._id.toString();
      await redis.set(token, 1, 'EX', c.get('authTokenExpireTime'));
      return user;
    } else {
      return null;
    }
  }
};

module.exports = {
  getUserFromToken,
  generateAuthToken,
  logout,
};
