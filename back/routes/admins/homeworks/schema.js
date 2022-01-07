'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const deleteFile = cs._id;

const reviewHomework = cs.objectSchema(
  {
    status: cs.enumString(['accepted', 'rejected', 'unknown']),
    comment: cs.stringSchema(0, 512),
  },
  ['status']
);

const updateFile = cs.updateSchema(reviewHomework);

const listFiles = cs.listResult;
listFiles.properties.termIndex = cs.numberString(1);

const getHomework = cs._id;
const count = cs.count;

module.exports = {
  listFiles,
  deleteFile,
  updateFile,
  reviewHomework,
  getHomework,
  count,
};
