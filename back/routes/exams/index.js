'use strict';
const express = require('express');
const u = require('util');
const c = require('config');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const auth = require('../../middleware/auth');
const mongo = require('../../startup/mongoUtil');
const redis = require('../../startup/redisClient');
const validate = require('../../middleware/validate');
const listResult = require('../../tools/listResult');
const { errMsg, msg } = require('../../tools/message');
const { generateAuthToken, logout, getUserFromToken } = require('../../tools/auth');

const router = express.Router();

const termsCollection = mongo.getCollection('terms');
const usersCollection = mongo.getCollection('users');
const filesCollection = mongo.getCollection('files');
const sectionsCollection = mongo.getCollection('sections');
const collection = mongo.getCollection('exams');
const answersCollection = mongo.getCollection('answers');

router.get('/', [auth, validate(s.listExams, 'query')], async (req, res) => {
  const result = await answersCollection
    .aggregate([
      { $match: { userId: objectId(req.user._id) } },
      { $sort: { createdAt: 1 } },
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
          from: 'terms',
          localField: 'exams.termId',
          foreignField: '_id',
          as: 'terms',
        },
      },
      { $unwind: '$terms' },
      // { $sort: { 'terms.index': 1 } },
      {
        $group: {
          _id: '$terms._id',
          termIndex: { $first: '$terms.index' },
          // shit: "terms.index",
          data: {
            $push: {
              termIndex: '$terms.index',
              exam: {
                _id: '$_id',
                status: '$status',
                comment: '$comment',
                activity: {
                  $arrayElemAt: [
                    { $arrayElemAt: ['$terms.sections', '$exams.sectionIndex'] },
                    '$exams.activityIndex',
                  ],
                },
                sectionIndex: '$exams.sectionIndex',
                activityIndex: '$exams.activityIndex',
              },
            },
          },
        },
      },
    ])
    .toArray();
  const filteredResult = result.map((i) => {
    return {
      ...i,
      data: i.data.map((j) => {
        const act = {...j.exam.activity};
        delete j.exam.activity;
        return {
          ...j,
          exam: {...j.exam,title: act.title}
        };
      }),
    };
  });
  return res.json(filteredResult);
});
router.get('/:_id', [auth, validate(s.getExam, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'itemNotFound');
  let answered = await answersCollection.findOne({
    userId: new objectId(req.user._id),
    examId: new objectId(req.params._id),
  });
  if (result.history) delete result.history;
  const term = await termsCollection.findOne({ _id: new objectId(result.termId) });
  let hasTime = await redis.get(req.params._id + req.user._id.toString());
  if (answered && !hasTime) return errMsg(req, res, 'alreadyAnswered');
  if (!hasTime) {
    hasTime = result.timeout * 60;
    await redis.set(req.params._id + req.user._id.toString(), 1, 'EX', hasTime);
  } else {
    hasTime = await redis.ttl(req.params._id + req.user._id.toString());
  }
  // else hasTime = await redis.ttl(req.params._id+req.user._id.toString());
  if (!answered)
    await answersCollection.insertOne({
      userId: new objectId(req.user._id),
      examId: result._id,
      createdAt: new Date(),
      answers: [],
    });
  // if (!user.progress) user.progress = { lastTerm: 0, lastIndex: 0 }; //TODO CHECK CRED

  result.timeleft = hasTime / 60;
  result.title =
    term.sections[Number(result.sectionIndex)][Number(result.activityIndex)].title;
  result.description =
    term.sections[Number(result.sectionIndex)][Number(result.activityIndex)].description;
  res.json(result);
});

router.get('/info/:_id', [auth], async (req, res) => {
  const result = await collection.findOne(
    { _id: new objectId(req.params._id) },
    { projection: { questions: 0 } }
  );
  if (!result) return errMsg(req, res, 'itemNotFound');
  const term = await termsCollection.findOne({ _id: new objectId(result.termId) });
  const answer = await answersCollection.findOne({ _id: result.examId });
  result.status = answer ? answer.status : 'unknown';
  result.title =
    term.sections[Number(result.sectionIndex)][Number(result.activityIndex)].title;
  result.description =
    term.sections[Number(result.sectionIndex)][Number(result.activityIndex)].description;
  res.json(result);
});

router.post('/', [auth, validate(s.submitExam)], async (req, res) => {
  const exam = await collection.findOne({ _id: new objectId(req.body._id) });
  if (!exam) return errMsg(req, res, 'itemNotFound');
  const timeout = await redis.get(req.body._id + req.user._id.toString());
  if (!timeout) return errMsg(req, res, 'authenticationFailed');
  delete req.body._id;
  req.body.modifiedAt = new Date();
  req.body.status = 'unknown';
  const result = await answersCollection.updateOne(
    { userId: new objectId(req.user._id), examId: exam._id },
    { $set: { ...req.body } }
  );
  res.json(result);
});

router.get('/check/:_id', [auth], async (req, res) => {
  const exam = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!exam) return errMsg(req, res, 'itemNotFound');
  const timeout = await redis.get(req.params._id + req.user._id.toString());
  if (!timeout) return errMsg(req, res, 'timesUp');
  const answers = await answersCollection.findOne({
    userId: new objectId(req.user._id),
    examId: exam._id,
  });
  const result = answers.answers.map((item) => !!!item.answer);
  res.json(result);
});

module.exports = router;
