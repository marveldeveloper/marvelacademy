'use strict';
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const { logout } = require('../../../tools/auth');
const mongo = require('../../../startup/mongoUtil');
const listResult = require('../../../tools/listResult');
const validate = require('../../../middleware/validate');
const bcrypt = require('bcrypt');
const { errMsg, msg } = require('../../../tools/message');
const { checkDuplicate } = require('../../../tools/user');
const c = require('config');

const router = express.Router();
const collection = mongo.getCollection('users');

router.get('/', validate(s.listUsers, 'query'), async (req, res) => {
  return listResult(req, res, [
    'users',
    {},
    { password: 0 },
    ['phone', 'email', 'firstName', 'lastName'],
  ]);
});

router.get('/:_id', [validate(s.getUser, 'params')], async (req, res) => {
  let result = await collection.findOne({ _id: new objectId(req.params._id) });
  res.json(result);
});

router.put('/', [validate(s.updateUser)], async (req, res) => {
  const id = new objectId(req.body._id);
  delete req.body._id;
  if (req.body.username) {
    let query = {
      username: {
        $regex: ['^', req.body.username.trim(), '$'].join(''),
        $options: '-i',
      },
    };
    const duplicate = await collection.findOne(query);
    if (duplicate)
      if (duplicate._id.toString() !== id.toString())
        return errMsg(req, res, 'duplicateUsername');
  }
  if (req.body.password)
    req.body.password = bcrypt.hashSync(req.body.password, c.get('bcryptSaltRounds'));
  await collection.updateOne({ _id: id }, { $set: { ...req.body } });
  res.sendStatus(200);
});

module.exports = router;
