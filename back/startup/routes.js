'use strict';
const express = require('express');
const users = require('../routes/users');
const terms = require('../routes/terms');
const exams = require('../routes/exams');
const homeworks = require('../routes/homeworks');
const pubCategories = require('../routes/pub/categories');
const pubVideos = require('../routes/pub/videos');
const admins = require('../routes/admins');

const error = require('../middleware/error');
const debug = require('../middleware/debug');
const { errMsg } = require('../tools/message');

module.exports = (app) => {
  app.use(debug);
  app.use('/api/users', users);
  app.use('/api/terms', terms);
  app.use('/api/exams', exams);
  app.use('/api/homeworks', homeworks);
  app.use('/api/admins', admins);
  app.use('/api/pub/categories', pubCategories);
  app.use('/api/pub/videos', pubVideos);
  app.use('/contents', express.static('contents'));
  app.use('/homeworks', express.static('homeworks'));
  app.use(error);
  app.use((req, res, next) => {
    return errMsg(req, res, 'notFound');
  });
};
