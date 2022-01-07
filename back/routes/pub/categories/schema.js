'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const getCategory = cs._id;

const listCategories = cs.listResult;

module.exports = {
  getCategory,
  listCategories,
};
