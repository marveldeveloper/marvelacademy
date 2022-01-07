'use strict';
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');
const { logout } = require('../../../tools/auth');
const mongo = require('../../../startup/mongoUtil');
const listResult = require('../../../tools/listResult');
const validate = require('../../../middleware/validate');
const multer = require('multer');
const { randomString } = require('../../../tools/random');
const { errMsg, msg } = require('../../../tools/message');

const router = express.Router();
const collection = mongo.getCollection('exams');
const termsCollection = mongo.getCollection('terms');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './contents/');
  },
  filename: (req, file, cb) => {
    const extension = /*(*/ file.originalname; /*.match(/\.+[\S]+$/) || [])[0]*/
    cb(null, randomString(24, true) + extension);
  },
});

const videoFilter = (req, file, cb) => {
  // reject a file
  let validTypes = ['video/mp4', 'video/webm', 'image/jpeg', 'image/jpg', 'image/png'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const videoUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter: videoFilter,
});

router.get('/', validate(s.listExams, 'query'), async (req, res) => {
  return listResult(req, res, [
    'exams',
    {},
    { history: 0 },
    ['title', 'index', 'createdAt', 'termId', 'modifiedDate'],
  ]);
});

router.get('/:_id', [validate(s.getExam, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'itemNotFound');
  if (result.history) delete result.history;
  res.json(result);
});

router.post('/', [validate(s.createExam)], async (req, res) => {
  req.body.createdAt = new Date();
  req.body.termId = new objectId(req.body.termId);
  req.body.sectionIndex = Number(req.body.sectionIndex);
  req.body.activityIndex = Number(req.body.activityIndex);
  req.body.deleted = false;
  req.body.version = 0;
  const term = await termsCollection.findOne({ _id: req.body.termId });
  if (!term) return errMsg(req, res, 'termNotFound');

  if (!term.sections[req.body.sectionIndex][req.body.activityIndex])
    return errMsg(req, res, 'activityNotExam');
  if (term.sections[req.body.sectionIndex][req.body.activityIndex].type !== 'exam')
    return errMsg(req, res, 'activityNotExam');
  if (term.sections[req.body.sectionIndex][req.body.activityIndex].exam._id)
    return errMsg(req, res, 'examExists');
  const resp = await collection.insertOne(req.body);
  term.sections[req.body.sectionIndex][req.body.activityIndex].exam = {
    _id: resp.insertedId,
    timeout: req.body.timeout,
  };
  let termId = term._id;
  delete term._id;
  await termsCollection.updateOne({ _id: termId }, { $set: { ...term } });
  res.json(resp);
});

router.put('/', [validate(s.updateExam)], async (req, res) => {
  req.body.modifiedAt = new Date();
  let _id = new objectId(req.body._id);
  const exam = await collection.findOne({ _id: _id });
  if (!exam) return errMsg(req, res, 'itemNotFound');
  if (req.body.termId) req.body.termId = new objectId(req.body.termId);
  req.body.sectionIndex = Number(req.body.sectionIndex || exam.sectionIndex);
  req.body.activityIndex = Number(req.body.activityIndex || exam.activityIndex);
  if (req.body.questions) {
    req.body.questions.forEach((question, index) => {
      if (exam.questions[index]) {
        if (exam.questions[index].video)
          req.body.questions[index].video = exam.questions[index].video;
        if (exam.questions[index].image)
          req.body.questions[index].image = exam.questions[index].image;
      }
    });
  }
  req.body.version = exam.version + 1;
  delete req.body._id;
  const resp = await collection.updateOne(
    { _id: _id },
    { $set: { ...req.body, history: { [exam.version]: exam } } }
  );
  return res.json(resp);
});

router.delete('/', [validate(s.deleteExam)], async (req, res) => {
  // const resp = await collection.updateOne(
  //   { _id: new objectId(req.body._id) },
  //   { $set: { deleted: true } }
  // );
  const resp = await collection.deleteOne({ _id: new objectId(req.body._id) });
  res.json(resp);
});

router.post(
  '/files',
  [
    videoUpload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
    validate(s.addFile),
  ],
  async (req, res) => {
    if (!req.files) return errMsg(req, res, 'fileRequired');
    const _id = new objectId(req.body.examId);
    const exam = await collection.findOne({ _id: _id });
    if (!exam) return errMsg(req, res, 'itemNotFound');
    if (!exam.questions) return errMsg(req, res, 'itemNotFound');
    if (!exam.questions[Number(req.body.index)]) return errMsg(req, res, 'itemNotFound');
    if (req.files.image)
      exam.questions[Number(req.body.index)].image = req.files.image.map(
        (item) => item.path
      )[0];
    if (req.files.video)
      exam.questions[Number(req.body.index)].video = req.files.video.map(
        (item) => item.path
      )[0];
    delete exam._id;
    await collection.updateOne({ _id: _id }, { $set: { ...exam } });
    res.json('OK');
  }
);

router.delete('/files', [validate(s.deleteFile)], async (req, res) => {
  const _id = new objectId(req.body.examId);
  const exam = await collection.findOne({ _id: _id });
  if (!exam) return errMsg(req, res, 'itemNotFound');
  if (!exam.questions) return errMsg(req, res, 'itemNotFound');
  if (!exam.questions[Number(req.body.index)]) return errMsg(req, res, 'itemNotFound');
  delete exam.questions[Number(req.body.index)].image;
  delete exam.questions[Number(req.body.index)].video;
  delete exam._id;
  await collection.updateOne({ _id: _id }, { $set: { ...exam } });
  res.json('OK');
});

module.exports = router;
