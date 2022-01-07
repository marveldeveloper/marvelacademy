'use strict';
const cs = require('../../tools/commonSchemas');

const submitExam = cs.objectSchema(
  {
    _id: cs.objectId,
    answers: cs.arraySchema(
      null,
      null,
      null,
      cs.objectSchema({ answer: cs.stringSchema(0, 100000) }, ['answer'])
    ),
  },
  ['answers', '_id']
);

const getExam = cs._id;

const listExams = cs.listResult;

module.exports = {
  submitExam,
  listExams,
  getExam,
};
