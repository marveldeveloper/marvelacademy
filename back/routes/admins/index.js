'use strict';
const express = require('express');

const users = require('./users');
const files = require('./files');
const terms = require('./terms');
const exams = require('./exams');
const homeworks = require('./homeworks');
const answers = require('./answers');
const pubCategories = require('./pub/categories');
const pubVideos = require('./pub/videos');
const isAdmin = require('../../middleware/admin');
const activityLog = require('../../middleware/activityLog');
const authentication = require('../../middleware/auth');

const router = express.Router();

router.use(authentication);
router.use(activityLog);
router.use(isAdmin);
router.use('/users', users);
router.use('/files', files);
router.use('/terms', terms);
router.use('/exams', exams);
router.use('/homeworks', homeworks);
router.use('/answers', answers);
router.use('/pub/categories', pubCategories);
router.use('/pub/videos', pubVideos);

module.exports = router;
