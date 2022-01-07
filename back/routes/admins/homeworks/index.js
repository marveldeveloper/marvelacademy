'use strict';
const u = require('util');
const fs = require('fs');
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const c = require('config');

const mongo = require('../../../startup/mongoUtil');
const listResult = require('../../../tools/listResult');
const validate = require('../../../middleware/validate');
const { promoteStudent } = require('../../../tools/user');
const { errMsg, msg } = require('../../../tools/message');
const { randomString } = require('../../../tools/random');

const router = express.Router();
const collection = mongo.getCollection('homeworks');
const usersCollection = mongo.getCollection('users');
const termsCollection = mongo.getCollection('terms');

router.get('/', validate(s.listFiles, 'query'), async (req, res) => {
  let query = {};
  if ('termIndex' in req.query) query.termIndex = Number(req.query.termIndex);
  let maxPerPage = c.get('maxPerPage');
  let perPage = parseInt(req.query.perPage) || maxPerPage;
  perPage = maxPerPage > perPage ? perPage : maxPerPage;
  perPage = 1 > perPage ? 1 : perPage;
  let page = parseInt(req.query.page) || 1;

  const searchFields = ['firstName', 'lastName'];
  let search = req.query.search || null;
  let regex = null;
  if (search) {
    regex = { $regex: `${search}.*`, $options: '-i' };
    if (searchFields) {
      query['$or'] = '$or' in query ? query['$or'] : [];
      searchFields.forEach((searchField) => {
        let temp = {};
        temp[searchField] = regex;
        query['$or'].push(temp);
      });
    }
  }
  const result = await collection
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'users',
        },
      },
      { $unwind: '$users' },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$users.firstName' },
          lastName: { $first: '$users.lastName' },
          termId: { $first: '$termId' },
          status: { $first: '$status' },
          path: { $first: '$path' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $match: { ...query } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          pages: [
            { $count: 'totalItems' },
            { $addFields: { page: page, perPage: perPage } },
          ],
          data: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
        },
      },

      // {$push:{questions: '$exams.question'}}
    ])
    .toArray();
  return res.json(result[0]);
  // return listResult(req, res, ['answers', query]);
});

router.get('/:_id', validate(s.getHomework, 'params'), async (req, res) => {
  const result = await collection
    .aggregate([
      { $match: { _id: new objectId(req.params._id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'users',
        },
      },
      { $unwind: '$users' },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$users._id' },
          termId: { $first: '$termId' },
          firstName: { $first: '$users.firstName' },
          lastName: { $first: '$users.lastName' },
          sectionIndex: { $first: '$sectionIndex' },
          activityIndex: { $first: '$activityIndex' },
          path: { $first: '$path' },
          status: { $first: '$status' },
        },
      },
      // { $sort: { 'terms.index': 1 } },
      // {$push:{questions: '$exams.question'}}
    ])
    .toArray();
  return res.json(result[0]);
  // return listResult(req, res, ['answers', query]);
});

router.post('/review/:_id', [validate(s.reviewHomework)], async (req, res) => {
  const _id = new objectId(req.params._id);
  let resp = await collection.findOne({ _id: _id });
  if (!resp) return errMsg(req, res, 'itemNotFound');
  if (req.body.status === 'accepted')
    await promoteStudent(resp.userId, resp.termId, resp.sectionIndex, resp.activityIndex);
  resp = await collection.updateOne(
    { _id: _id },
    { $set: { status: req.body.status, comment: req.body.comment } }
  );
  return res.json(resp);
});

// router.post(
//     '/',
//     [upload.single('file'), validate(s.addFile)],
//     async (req, res) => {
//         if (!req.file) return errMsg(req, res, 'fileRequired');
//         let file = {
//             path: req.file[0].path,
//             createdAt: new Date(),
//             sectionId: new objectId(req.body.sectionId),
//             title: req.body.title,
//             description: req.body.description,
//             deleted: false,
//         };
//         const oldFile = await collection.findOne({ sectionId: new objectId(req.body.sectionId) });
//         if(oldFile) {
//             await collection.deleteOne({ _id: oldFile._id });
//             await unlink(oldFile.path);
//             if(oldFile.thumbnail)  await unlink(oldFile.thumbnail);
//         }
//         const  resp = await collection.insertOne(file);
//         return res.json(resp);
//     }
// );

// router.delete('/', validate(s.deleteFile), async (req, res) => {
//     const file = await collection.findOne({ _id: new objectId(req.body._id) });
//     await unlink(file.path);
//     const result = await collection.deleteOne({ _id: new objectId(req.body._id) });
//     return res.json(result);
// });

module.exports = router;
