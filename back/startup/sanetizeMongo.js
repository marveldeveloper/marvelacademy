'use strict';
const mongoSanitize = require('express-mongo-sanitize');

module.exports = (app) => {
  app.use(
    mongoSanitize({
      replaceWith: '_',
    })
  );
};
