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
const collection = mongo.getCollection('answers');
const examsCollection = mongo.getCollection('exams');
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
        $lookup: {
          from: 'exams',
          localField: 'examId',
          foreignField: '_id',
          as: 'exams',
        },
      },
      { $unwind: '$exams' },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$users.firstName' },
          lastName: { $first: '$users.lastName' },
          examId: { $first: '$examId' },
          termId: { $first: '$exams.termId' },
          status: { $first: '$status' },
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

router.get('/:_id', validate(s.getAnswer, 'params'), async (req, res) => {
  const result = await collection
    .aggregate([
      { $match: { _id: new objectId(req.params._id) } },
      {
        $lookup: {
          from: 'exams',
          localField: 'examId',
          foreignField: '_id',
          as: 'exams',
        },
      },
      { $unwind: '$exams' },
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
          questions: { $push: '$exams.questions' },
          answers: { $push: '$answers' },
          firstName: { $first: '$users.firstName' },
          lastName: { $first: '$users.lastName' },
          status: { $first: '$status' },
          userId: { $first: '$users._id' },
        },
      },
      // { $sort: { 'terms.index': 1 } },
      // {$push:{questions: '$exams.question'}}
    ])
    .toArray();
  if (!result[0]) errMsg(req, res, 'itemNotFound');
  return res.json(result[0]);
  // return listResult(req, res, ['answers', query]);
});

router.post('/review/:_id', [validate(s.reviewAnswer)], async (req, res) => {
  const _id = new objectId(req.params._id);
  let resp = await collection.findOne({ _id: _id });
  if (!resp) return errMsg(req, res, 'itemNotFound');
  const exam = await examsCollection.findOne({ _id: resp.examId });
  resp = { ...resp, ...exam };
  if (req.body.status === 'accepted')
    await promoteStudent(resp.userId, resp.termId, resp.sectionIndex, resp.activityIndex);
  resp = await collection.updateOne(
    { _id: _id },
    { $set: { status: req.body.status, comment: req.body.comment } }
  );
  return res.json(resp);
});

module.exports = router;
