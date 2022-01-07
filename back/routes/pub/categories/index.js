'use strict';
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const { logout } = require('../../../tools/auth');
const mongo = require('../../../startup/mongoUtil');
const listResult = require('../../../tools/listResult');
const validate = require('../../../middleware/validate');
const { errMsg, msg } = require('../../../tools/message');

const router = express.Router();
const collection = mongo.getCollection('pub_categories');

router.get('/', validate(s.listCategories, 'query'), async (req, res) => {
  return listResult(req, res, [
    'pub_categories',
    { status: 'enabled' },
    { _id: 0, status: 0 },
    ['title', 'title_fa', 'description'],
  ]);
});

module.exports = router;
