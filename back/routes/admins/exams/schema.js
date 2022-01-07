'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const createExam = cs.objectSchema(
  {
    termId: cs.objectId,
    sectionIndex: cs.numberString(1),
    activityIndex: cs.numberString(1),
    title: cs.stringSchema(0, 32),
    description: cs.stringSchema(0, 512),
    timeout: cs.numberString(5),
    questions: cs.arraySchema(
      null,
      null,
      null,
      cs.objectSchema(
        {
          question: cs.stringSchema(0, 100000),
          type: cs.enumString(['options', 'survey', 'full']),
          options: cs.arraySchema(4, 4, null, cs.stringSchema(0, 256)),
        },
        ['question', 'type']
      )
    ),
  },
  ['termId', 'sectionIndex', 'activityIndex', 'questions', 'timeout']
);

const updateExam = cs.updateSchema(createExam);

const deleteExam = cs._id;

const getExam = cs._id;

const listExams = cs.listResult;

const addFile = cs.objectSchema(
  {
    examId: cs.objectId,
    index: cs.numberString(2),
  },
  ['examId', 'index']
);

const deleteFile = addFile;

module.exports = {
  createExam,
  updateExam,
  deleteExam,
  getExam,
  listExams,
  addFile,
  deleteFile,
};
