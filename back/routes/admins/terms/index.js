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
const collection = mongo.getCollection('terms');
const filesCollection = mongo.getCollection('files');
const examsCollection = mongo.getCollection('exams');

router.get('/', validate(s.listTerms, 'query'), async (req, res) => {
  return listResult(req, res, ['terms', {}, {}, ['title', 'index', 'createdAt']]);
});

router.get('/:_id', [validate(s.getTerm, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'termNotFound');

  for (let i = 0; i < result.sections.length; i++) {
    for (let j = 0; j < result.sections[i].length; j++) {
      if (result.sections[i][j].type === 'exam') {
        const exam = await examsCollection.findOne({
          _id: new objectId(result.sections[i][j]?.exam?._id),
        });
        if (exam) {
          if (exam.history) delete exam.history;
          result.sections[i][j].exam = exam;
        }
      }
    }
  }
  // const files = await filesCollection.aggregate([
  //     { $match: { termId: new objectId(req.params._id), deleted: false } },
  //     { $project : { createdAt : 0, deleted : 0, termId: 0 , _id: 0 }},
  //     {$sort: { index: 1}}
  // ]).toArray();
  // const questions = await questionsCollection.aggregate([
  //     { $match: { termId: new objectId(req.params._id), deleted: false } },
  //     { $project : { createdAt : 0, deleted : 0, termId: 0 , _id: 0 }},
  //     {$sort: { index: 1}}
  // ]).toArray();
  // result.files = files;
  // result.questions = questions;
  res.json(result);
});

router.post('/', [validate(s.createTerm)], async (req, res) => {
  req.body.createdAt = new Date();
  req.body.index = Number(req.body.index);
  req.body.time = Number(req.body.time);
  if (!req.body.sections) req.body.sections = [[]];
  req.body.totalExams = req.body.sections.filter((a) => a.type === 'exam').length;
  req.body.totalVideos = req.body.sections.filter((a) => a.type === 'video').length;
  const duplicateIndex = await collection.findOne({ index: req.body.index });
  if (duplicateIndex) return errMsg(req, res, 'duplicateIndex');
  const resp = await collection.insertOne(req.body);
  res.json(resp);
});

router.put('/', [validate(s.updateTerm)], async (req, res) => {
  let _id = new objectId(req.body._id);
  if (req.body.index) req.body.index = Number(req.body.index);
  delete req.body._id;
  const term = await collection.findOne({ _id: _id });
  if (!term) return errMsg(req, res, 'termNotFound');
  req.body.modifiedAt = new Date();
  // if (req.body.sections) {
  //   if (req.body.sections.length > 0) {
  //     for (let i = 0; i < req.body.sections.length; i++) {
  //       if (!!req.body.sections[i] && !!term.sections[i]) {
  //         for (let j = 0; j < req.body.sections[i].length; j++) {
  //           if (!!req.body.sections[i][j] && !!term.sections[i][j])
  //             if (!!req.body.sections[i][j].type && !!term.sections[i][j].type)
  //               if (term.sections[i][j].type === req.body.sections[i][j].type) {
  //                 if (req.body.sections[i][j].type === 'exam') {
  //                   const exam = await examsCollection.findOne({
  //                     termId: _id,
  //                     sectionIndex: i,
  //                     activityIndex: j,
  //                   });
  //                   req.body.sections[i][j].exam = exam
  //                     ? {
  //                         _id: exam._id,
  //                         timeout: exam.timeout,
  //                       }
  //                     : {};
  //                 } else {
  //                   const files = await filesCollection.findOne({
  //                     termId: _id,
  //                     sectionIndex: i,
  //                     activityIndex: j,
  //                   });
  //                   req.body.sections[i][j].files = files ? files : {};
  //                 }
  //               } else {
  //                 await filesCollection.deleteOne({
  //                   termId: _id,
  //                   sectionIndex: i,
  //                   activityIndex: j,
  //                 });
  //                 await examsCollection.deleteOne({
  //                   termId: _id,
  //                   sectionIndex: i,
  //                   activityIndex: j,
  //                 });
  //               }
  //         }
  //       }
  //     }
  //   }
  req.body.totalExams = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'exam').length;
  req.body.totalVideos = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'video').length;
  //}

  await collection.updateOne({ _id: _id }, { $set: { ...req.body } });
  return res.json(req.body);
});

router.post('/activity', [validate(s.createActivity)], async (req, res) => {
  let termId = new objectId(req.body.termId);
  let activityIndex = Number(req.body.activityIndex);
  let sectionIndex = Number(req.body.sectionIndex);
  const term = await collection.findOne({ _id: termId });
  if (!term) return errMsg(req, res, 'termNotFound');
  term.modifiedAt = new Date();
  for (let i = 0; i <= sectionIndex; i++) if (!term.sections[i]) term.sections[i] = [];
  for (let i = 0; i < activityIndex - 1; i++)
    if (!term.sections[sectionIndex][i]) return errMsg(req, res, 'addPreviousActivity');

  term.sections[sectionIndex][activityIndex] = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
  };
  if (term.sections[sectionIndex][activityIndex].type === 'exam') {
    const exam = await examsCollection.findOne({
      termId: termId,
      sectionIndex: sectionIndex,
      activityIndex: activityIndex,
      deleted: false,
    });
    term.sections[sectionIndex][activityIndex].exam = exam
      ? { _id: exam._id, timeout: exam.timeout }
      : {};
  } else {
    const files = await filesCollection.findOne({
      termId: termId,
      sectionIndex: sectionIndex,
      activityIndex: activityIndex,
    });
    term.sections[sectionIndex][activityIndex].files = files ? files : {};
  }
  term.totalExams = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'exam').length;
  term.totalVideos = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'video').length;
  delete term._id;
  const resp = await collection.updateOne({ _id: termId }, { $set: { ...term } });
  return res.json(resp);
});

router.delete('/activity', [validate(s.deleteActivity)], async (req, res) => {
  let termId = new objectId(req.body.termId);
  let activityIndex = Number(req.body.activityIndex);
  let sectionIndex = Number(req.body.sectionIndex);
  const term = await collection.findOne({ _id: termId });
  if (!term) return errMsg(req, res, 'termNotFound');
  for (let i = 0; i < sectionIndex; i++) if (!term.sections[i]) term.sections[i] = [];
  if (term.sections[sectionIndex][activityIndex]?.type === 'exam')
    await examsCollection.updateOne(
      { _id: term.sections[sectionIndex][activityIndex]?.exam?._id },
      { $set: { deleted: true } }
    );
  term.sections[sectionIndex].splice(activityIndex, 1);
  for (let i = activityIndex; i < term.sections[sectionIndex].length; i++) {
    if (term.sections[sectionIndex][i].type === 'exam') {
      const exam = await examsCollection.findOne({
        termId: termId,
        sectionIndex: sectionIndex,
        activityIndex: i + 1,
        deleted: false,
      });
      await examsCollection.updateOne(
        {
          termId: termId,
          sectionIndex: sectionIndex,
          activityIndex: i + 1,
        },
        { $set: { activityIndex: i } }
      );
      term.sections[sectionIndex][i].exam = exam
        ? { _id: exam._id, timeout: exam.timeout }
        : {};
    } else {
      const files = await filesCollection.findOne({
        termId: termId,
        sectionIndex: sectionIndex,
        activityIndex: i + 1,
      });
      await filesCollection.updateOne(
        {
          termId: termId,
          sectionIndex: sectionIndex,
          activityIndex: i + 1,
        },
        { $set: { activityIndex: i } }
      );
      term.sections[sectionIndex][i].files = files ? files : {};
    }
  }
  term.totalExams = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'exam').length;
  term.totalVideos = term.sections
    .reduce((a, b) => [...a, ...b])
    .filter((a) => a.type === 'video').length;
  delete term._id;
  const resp = await collection.updateOne({ _id: termId }, { $set: { ...term } });
  return res.json(resp);
});

router.delete('/section', [validate(s.deleteSection)], async (req, res) => {
  let termId = new objectId(req.body.termId);
  let sectionIndex = Number(req.body.sectionIndex);
  const term = await collection.findOne({ _id: termId });
  if (!term) return errMsg(req, res, 'termNotFound');
  if (!term.sections[sectionIndex]) return errMsg(req, res, 'sectionNotDeleted');
  term.sections.splice(sectionIndex, 1);
  for (let i = sectionIndex; i < term.sections.length; i++) {
    for (let j = 0; j < term.sections[i].length; j++) {
      if (term.sections[i][j].type === 'exam') {
        const exam = await examsCollection.findOne({
          termId: termId,
          sectionIndex: i + 1,
          activityIndex: j,
        });
        examsCollection.updateOne(
          {
            termId: termId,
            sectionIndex: i + 1,
            activityIndex: j,
          },
          { $set: { sectionIndex: i } }
        );
        term.sections[i][j].exam = exam ? { _id: exam._id, timeout: exam.timeout } : {};
      } else {
        const files = await filesCollection.findOne({
          termId: termId,
          sectionIndex: i + 1,
          activityIndex: j,
        });
        filesCollection.updateOne(
          {
            termId: termId,
            sectionIndex: i + 1,
            activityIndex: j,
          },
          { $set: { sectionIndex: i } }
        );
        term.sections[i][j].files = files ? files : {};
      }
    }
  }
  if (term.sections.length) {
    term.totalExams = term.sections
      .reduce((a, b) => [...a, ...b])
      .filter((a) => a.type === 'exam').length;
    term.totalVideos = term.sections
      .reduce((a, b) => [...a, ...b])
      .filter((a) => a.type === 'video').length;
  } else {
    term.sections = [[]];
    term.totalExams = 0;
    term.totalVideos = 0;
  }
  delete term._id;
  const resp = await collection.updateOne({ _id: termId }, { $set: { ...term } });
  return res.json(resp);
});

router.delete('/', [validate(s.deleteTerm)], async (req, res) => {
  const resp = await collection.deleteOne({ _id: new objectId(req.body._id) });
  res.json(resp);
});

module.exports = router;
