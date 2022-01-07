'use strict';
const { errors, messages } = require('./messageText');
const { parse } = require('./string');

const translate = (source, message, lang, params) => {
  if (message in source) message = source[message][lang];

  return parse(message, params || []);
};

const errMsg = (req, res, message, params = []) => {
  let lang = req.body.lang || req.query.lang || 'fa';
  if (message in errors)
    return res.status(errors[message]['status']).json({
      errors: [{ reason: translate(errors, message, lang, params) }],
      code: errors[message]['code'],
    });

  return res.status(400).send({ errors: [message] });
};

const msg = (req, res, message, params = []) => {
  let lang = req.query.lang || 'fa';
  return res.json({ message: translate(messages, message, lang, params) });
};

module.exports = {
  translate,
  errMsg,
  msg,
};
