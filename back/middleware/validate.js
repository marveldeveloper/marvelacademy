'use strict';
const validate = require('../tools/validate');

module.exports = (schema, type = 'body') => {
  return (req, res, next) => {
    let errors;
    let lang = req.query.lang || 'fa';
    delete req.query.lang;
    errors = validate(req[type], schema, lang);
    if (errors && errors.length) return res.status(400).json({ errors });
    next();
  };
};
