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

const collection = mongo.getCollection('terms');
const usersCollection = mongo.getCollection('users');
const filesCollection = mongo.getCollection('files');
const homeworksCollection = mongo.getCollection('homeworks');
const sectionsCollection = mongo.getCollection('sections');
const examsCollection = mongo.getCollection('exams');
const answersCollection = mongo.getCollection('answers');

router.get('/', [auth, validate(s.listTerms, 'query')], async (req, res) => {
  let user = await usersCollection.findOne({ _id: new objectId(req.user._id) });
  if (!user.progress) user.progress = { lastTerm: 0, lastIndex: 0 };
  // if (result.index > user.progress.lastTerm) return errMsg(req, res, 'notUnlocked');
  return listResult(req, res, [
    'terms',
    {},
    {
      title: 1,
      description: 1,
      teacherName: 1,
      totalExams: 1,
      totalVideos: 1,
      time: 1,
      index: 1,
      unlocked: {
        $cond: [{ $lt: ['$index', user.progress.lastTerm + 1] }, true, false],
      },
    },
    ['title', 'index'],
  ]);
});

router.get('/:_id', [auth, validate(s.getTerm, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'termNotFound');
  let user = await usersCollection.findOne({ _id: new objectId(req.user._id) });
  if (!user.progress) user.progress = { lastTerm: 0, lastSection: 0, lastActivity: 0 };
  if (result.index > user.progress.lastTerm) return errMsg(req, res, 'notUnlocked');
  let locked = false;
  for (let i = 0; i < result.sections.length; i++) {
    for (let j = 0; j < result.sections[i].length; j++) {
      // console.log(i,'laset sec', user.progress.lastSection);
      result.sections[i][j].unlocked = !locked;
      if (locked) {
        delete result.sections[i][j].files;
        delete result.sections[i][j].exam;
        delete result.sections[i][j].answer;
      }
      if (result.sections[i][j].type === 'exam') {
        if (!locked) {
          const answer = await answersCollection.findOne({
            userId: new objectId(req.user._id),
            examId: new objectId(result.sections[i][j]?.exam?._id),
          });
          if (answer) result.sections[i][j].status = answer.status;
          result.sections[i][j].asnwerd = !!answer;
          if (!result.sections[i][j]?.exam?._id) {
            locked = true;
            result.sections[i][j].unlocked = false;
          }
          if (result.index === user.progress.lastTerm) {
            if (i > user.progress.lastSection) locked = true;
            else if (i === user.progress.lastSection && j > user.progress.lastActivity)
              locked = true;
          }
        }
      } else if (result.sections[i][j].type === 'homework') {
        //TODO: Make one query and perform map or foreach for less database load
        const answer = await homeworksCollection.findOne({
          userId: new objectId(req.user._id),
          termId: result._id,
          sectionIndex: i,
          activityIndex: j,
        });
        if (answer) result.sections[i][j].answer = answer;
      }
    }
  }

  res.json(result);
});

module.exports = router;
