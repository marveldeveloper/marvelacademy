'use strict';
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const { logout } = require('../../../../tools/auth');
const mongo = require('../../../../startup/mongoUtil');
const listResult = require('../../../../tools/listResult');
const validate = require('../../../../middleware/validate');
const { errMsg, msg } = require('../../../../tools/message');

const router = express.Router();
const collection = mongo.getCollection('pub_categories');

router.get('/', validate(s.listCategories, 'query'), async (req, res) => {
  return listResult(req, res, [
    'pub_categories',
    {},
    {},
    ['title', 'title_fa', 'description', 'status'],
  ]);
});

router.get('/:_id', [validate(s.getCategory, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'itemNotFound');
  res.json(result);
});

router.post('/', [validate(s.createCategory)], async (req, res) => {
  let query = {
    title: {
      $regex: ['^', req.body.title.trim(), '$'].join(''),
      $options: '-i',
    },
  };
  const duplicate = await collection.findOne(query);
  if (duplicate) return errMsg(req, res, 'duplicateCategory');
  req.body.createdAt = new Date();
  req.body.count = 0;
  req.body.title_fa.trim();
  const resp = await collection.insertOne(req.body);
  res.json(resp);
});

router.put('/', [validate(s.updateCategory)], async (req, res) => {
  let _id = new objectId(req.body._id);
  req.body.modifiedAt = new Date();
  delete req.body._id;
  let query = {
    title: {
      $regex: ['^', req.body.title.trim(), '$'].join(''),
      $options: '-i',
    },
  };
  const duplicate = await collection.findOne(query);
  if (duplicate)
    if (duplicate._id.toString() !== _id.toString())
      return errMsg(req, res, 'duplicateCategory');
  if (req.body.title) req.body.title = req.body.title.trim();
  if (req.body.title_fa) req.body.title_fa = req.body.title_fa.trim();
  const resp = await collection.updateOne({ _id: _id }, { $set: { ...req.body } });
  return res.json(resp);
});

router.delete('/', [validate(s.deleteCategory)], async (req, res) => {
  const resp = await collection.deleteOne({ _id: new objectId(req.body._id) });
  res.json(resp);
});

module.exports = router;
