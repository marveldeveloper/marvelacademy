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
const collection = mongo.getCollection('pub_videos');

router.get('/', validate(s.listVideos, 'query'), async (req, res) => {
  if (req.query.category)
    return listResult(req, res, [
      'pub_videos',
      {
        status: 'enabled',
        category: {
          $regex: ['^', req.query.category.trim(), '$'].join(''),
          $options: '-i',
        },
      },
      { path: 0 },
      ['title', 'description', 'category', 'createdAt', 'time', 'status'],
    ]);
  return listResult(req, res, [
    'pub_videos',
    { status: 'enabled' },
    { path: 0 },
    ['title', 'description', 'category', 'createdAt', 'time', 'status'],
  ]);
});

router.get('/:_id', [validate(s.getVideo, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'itemNotFound');
  res.json(result);
});

module.exports = router;
