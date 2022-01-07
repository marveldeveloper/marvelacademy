'use strict';
const c = require('config');
const cs = require('../../../../tools/commonSchemas');

//TODO: ADD URL VALIDATION CHECK LATER
const createVideo = cs.objectSchema(
  {
    title: cs.stringSchema(0, 256),
    description: cs.stringSchema(0, 100000),
    category: cs.stringSchema(0, 64),
    status: cs.enumString(['enabled', 'disabled']),
  },
  ['title', 'description', 'status', 'category']
);

const updateVideo = cs.updateSchema(createVideo);

const deleteVideo = cs._id;

const getVideo = cs._id;

const listVideos = cs.listResult;

module.exports = {
  createVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  listVideos,
};
