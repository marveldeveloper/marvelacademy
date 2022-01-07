'use strict';
const express = require('express');
const u = require('util');
const c = require('config');
const objectId = require('mongodb').ObjectId;
const axios = require('axios');
const bcrypt = require('bcrypt');
const logger = require('../../startup/logging').logger;

const s = require('./schema');
const auth = require('../../middleware/auth');
const mongo = require('../../startup/mongoUtil');
const redis = require('../../startup/redisClient');
const validate = require('../../middleware/validate');
const { errMsg, msg } = require('../../tools/message');
const { generateAuthToken, logout, getUserFromToken } = require('../../tools/auth');

const router = express.Router();

const collection = mongo.getCollection('users');

router.get('/me', auth, async (req, res) => {
  const user = await collection.findOne({ _id: new objectId(req.user._id) });
  return res.json(user);
});

router.post('/send-sms', [validate(s.sendSms)], async (req, res) => {
  try {
    const code = await axios.get(
      `${c.get('authServerBaseUrl')}/api/authentication/${req.body.phone
        .trim()
        .substring(3)}/requestLoginCode`
    );
    return res.json(code.data);
  } catch (e) {
    return res.status(400).json({});
  }
});

router.post('/verify', [validate(s.verify)], async (req, res) => {
  try {
    const verify = await axios.get(
      `${c.get('authServerBaseUrl')}/api/authentication/${req.body.code}/${req.body.phone
        .trim()
        .substring(3)}/loginWithCode`
    );
    const query = { phone: req.body.phone.trim() };
    let user = await collection.findOne(query);
    const data = {};
    data.phone = req.body.phone.trim();
    data.email = verify.data.user.email;
    data.firstName = verify.data.user.firstName;
    data.lastName = verify.data.user.lastName;
    if (!user) {
      data.role = verify.data.isAdmin ? 'admin' : 'student';
      data.progress = { lastTerm: 0, lastSection: 0, lastActivity: 0 };
      await collection.insertOne(data);
    } else {
      await collection.updateOne({ _id: user._id }, { $set: data });
    }
    user = await collection.findOne({ phone: req.body.phone.trim() });

    const token = await generateAuthToken(user._id, user.phone, user.role);
    return res.header('x-auth-token', token).json({ role: user.role });
  } catch (e) {
    return res
      .status(e.response.status)
      .json({ errors: [{ code: e.response.data.message }] });
  }
});

router.post('/login', [validate(s.login)], async (req, res) => {
  let query = {
    username: {
      $regex: ['^', req.body.username.trim(), '$'].join(''),
      $options: '-i',
    },
  };
  let user = await collection.findOne(query);
  if (!user) return errMsg(req, res, 'authenticationFailedWith401');
  if (user.role !== 'admin' && user.role !== 'super')
    return errMsg(req, res, 'authenticationFailedWith401');
  if (!bcrypt.compareSync(req.body.password, user.password))
    return errMsg(req, res, 'authenticationFailedWith401');
  const token = await generateAuthToken(user._id, user.phone, user.role);
  return res.header('x-auth-token', token).json({ role: user.role });
});

module.exports = router;
