'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const createUser = cs.objectSchema(
  {
    role: cs.enumString(['student', 'admin', 'super']),
    phone: cs.phoneNumber,
    firstName: cs.stringSchema(3, 32),
    lastName: cs.stringSchema(3, 32),
    email: cs.email,
    username: cs.stringSchema(4, 64),
    password: cs.stringSchema(4, 64),
  },
  ['role', 'phone']
);

const updateUser = cs.updateSchema(createUser);

const deleteUser = cs._id;

const getUser = cs._id;

const listUsers = cs.listResult;

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  listUsers,
};
