'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const deleteFile = cs._id;

const addFile = cs.objectSchema(
  {
    sectionIndex: cs.numberString(2),
    activityIndex: cs.numberString(2),
    termId: cs.objectId,
    paths: cs.arraySchema(9, 0, null, cs.stringSchema(1, 256)),
  },
  ['sectionIndex', 'activityIndex', 'termId']
);
const addVideo = cs.objectSchema(
  {
    sectionIndex: cs.numberString(2),
    activityIndex: cs.numberString(2),
    termId: cs.objectId,
    paths: cs.arraySchema(9, 0, null, cs.stringSchema(1, 256)),
    thumbnail: cs.stringSchema(1, 2048),
    video: cs.stringSchema(1, 2048),
  },
  ['sectionIndex', 'activityIndex', 'termId']
);

const updateFile = cs.updateSchema(addFile);

const listFiles = cs.listResult;

const count = cs.count;

module.exports = {
  listFiles,
  deleteFile,
  updateFile,
  addFile,
  addVideo,
  count,
};
