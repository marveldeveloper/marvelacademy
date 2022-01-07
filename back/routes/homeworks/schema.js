'use strict';
const c = require('config');
const cs = require('../../tools/commonSchemas');

const deleteFile = cs._id;

const addFile = cs.objectSchema(
  {
    termId: cs.objectId,
    sectionIndex: cs.numberString(1),
    activityIndex: cs.stringSchema(1),
  },
  ['termId', 'sectionIndex', 'activityIndex']
);

const updateFile = cs.updateSchema(addFile);

const listFiles = cs.listResult;

const count = cs.count;

module.exports = {
  listFiles,
  deleteFile,
  updateFile,
  addFile,
  count,
};
