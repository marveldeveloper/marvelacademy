'use strict';
const c = require('config');
const cs = require('../../../tools/commonSchemas');

const getVideo = cs._id;

const listVideos = cs.listResult;
listVideos.properties.category = cs.stringSchema(0, 64);

module.exports = {
  getVideo,
  listVideos,
};
