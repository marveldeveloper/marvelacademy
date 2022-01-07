'use strict';
const c = require('config');
const cs = require('../../../../tools/commonSchemas');

const createCategory = cs.objectSchema(
  {
    title: cs.stringSchema(0, 64),
    title_fa: cs.stringSchema(0, 64),
    description: cs.stringSchema(0, 512),
    status: cs.enumString(['enabled', 'disabled']),
  },
  ['title', 'title_fa', 'description', 'status']
);

const updateCategory = cs.updateSchema(createCategory);

const deleteCategory = cs._id;

const getCategory = cs._id;

const listCategories = cs.listResult;

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  listCategories,
};
