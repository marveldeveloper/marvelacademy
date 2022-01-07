'use strict';
const mongo = require('../startup/mongoUtil');
const collection = mongo.getCollection('activityLog');

module.exports = async (req, res, next) => {
  await collection.insertOne({
    userId: req.user._id,
    method: req.method,
    path: req.path,
    params: req.params,
    body: req.body,
    createdAt: new Date(),
  });
  next();
};
