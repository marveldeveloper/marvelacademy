'use strict';
const cs = require('../../tools/commonSchemas');

const seed = cs.objectSchema(
  {
    phone: cs.phoneNumber,
    password: cs.rawString(32),
    role: cs.enumString(['student', 'admin']),
  },
  ['phone', 'role', 'password']
);

const sendSms = cs.objectSchema(
  {
    phone: cs.phoneNumber,
  },
  ['phone']
);

const verify = cs.objectSchema(
  {
    phone: cs.phoneNumber,
    code: cs.numberString(5),
  },
  ['phone', 'code']
);

const login = cs.objectSchema(
  {
    username: cs.stringSchema(3, 64),
    password: cs.stringSchema(3, 64),
  },
  ['username', 'password']
);

module.exports = {
  seed,
  sendSms,
  verify,
  login,
};
