'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const createTerm = cs.objectSchema(
  {
    title: cs.stringSchema(3, 64),
    description: cs.rawString(512),
    index: cs.numberString(3),
    teacherName: cs.stringSchema(3, 64),
    status: cs.enumString(['enabled', 'disabled']),
    time: cs.numberString(12),
    // sections: cs.arraySchema(
    //   null,
    //   null,
    //   null,
    //   cs.arraySchema(
    //     null,
    //     null,
    //     null,
    //     cs.objectSchema(
    //       {
    //         title: cs.stringSchema(0, 64),
    //         description: cs.stringSchema(0, 512),
    //         type: cs.enumString(['video', 'homework', 'exam']),
    //       },
    //       ['title', 'description', 'type']
    //     )
    //   )
    // ),
  },
  ['title', 'description', 'index', 'teacherName', 'status', 'time']
);

const createActivity = cs.objectSchema(
  {
    termId: cs.objectId,
    activityIndex: cs.numberString(2),
    sectionIndex: cs.numberString(2),
    title: cs.stringSchema(0, 64),
    description: cs.stringSchema(0, 512),
    type: cs.enumString(['video', 'homework', 'exam']),
  },
  ['termId', 'sectionIndex', 'activityIndex', 'title', 'description', 'type']
);

const updateTerm = cs.updateSchema(createTerm);

const deleteTerm = cs._id;

const deleteActivity = cs.objectSchema(
  {
    termId: cs.objectId,
    activityIndex: cs.numberString(2),
    sectionIndex: cs.numberString(2),
  },
  ['termId', 'sectionIndex', 'activityIndex']
);
const deleteSection = cs.objectSchema(
  {
    termId: cs.objectId,
    sectionIndex: cs.numberString(2),
  },
  ['termId', 'sectionIndex']
);

const getTerm = cs._id;

const listTerms = cs.listResult;

module.exports = {
  createTerm,
  updateTerm,
  deleteTerm,
  getTerm,
  listTerms,
  createActivity,
  deleteActivity,
  deleteSection,
};
