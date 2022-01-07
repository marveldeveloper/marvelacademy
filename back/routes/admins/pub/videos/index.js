'use strict';
const express = require('express');
const objectId = require('mongodb').ObjectId;
const path = require('path');

const s = require('./schema');
const { logout } = require('../../../../tools/auth');
const mongo = require('../../../../startup/mongoUtil');
const listResult = require('../../../../tools/listResult');
const validate = require('../../../../middleware/validate');
const multer = require('multer');
const {
  generateGifFromVideo,
  getVideoInfo,
  convertToJpeg,
  generateThumbnailFromVideo,
} = require('../../../../tools/video');
const { randomString } = require('../../../../tools/random');
const { errMsg, msg } = require('../../../../tools/message');

const router = express.Router();
const collection = mongo.getCollection('pub_videos');
const categoryCollection = mongo.getCollection('pub_categories');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './contents/');
  },
  filename: (req, file, cb) => {
    const extension = /*(*/ file.originalname; /*.match(/\.+[\S]+$/) || [])[0]*/
    cb(null, randomString(24, true) + extension);
  },
});

const videoFilter = (req, file, cb) => {
  // reject a file
  let validTypes = ['video/mp4', 'video/webm', 'image/jpeg', 'image/jpg', 'image/png'];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const videoUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 2,
  },
  fileFilter: videoFilter,
});

router.get('/', validate(s.listVideos, 'query'), async (req, res) => {
  return listResult(req, res, [
    'pub_videos',
    {},
    { path: 0 },
    ['title', 'description', 'category', 'createdAt', 'time', 'status'],
  ]);
});

router.get('/:_id', [validate(s.getVideo, 'params')], async (req, res) => {
  const result = await collection.findOne({ _id: new objectId(req.params._id) });
  if (!result) return errMsg(req, res, 'itemNotFound');
  res.json(result);
});

router.post(
  '/',
  [
    videoUpload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    validate(s.createVideo),
  ],
  async (req, res) => {
    if (!req.files?.video) return errMsg(req, res, 'fileRequired');
    req.body.path = req.files.video.map((item) => item.path)[0];
    if (!req.files?.thumbnail) {
      req.body.thumbnail = await generateThumbnailFromVideo(req.body.path);
    } else {
      req.body.thumbnail = req.files.thumbnail.map((item) => item.path)[0];
      req.body.thumbnail = await convertToJpeg(
        req.body.thumbnail,
        false,
        512,
        'contents',
        false
      );
    }
    req.body.preview = await generateGifFromVideo(req.body.path);
    req.body.createdAt = new Date();
    req.body.time = Number(req.body.time);
    req.body.category = req.body.category.trim();
    let query = {
      title: {
        $regex: ['^', req.body.category, '$'].join(''),
        $options: '-i',
      },
    };
    const hasCategory = await categoryCollection.findOne(query);
    if (!hasCategory) return errMsg(req, res, 'categoryNotFound');

    const info = await getVideoInfo(req.body.path);
    req.body.time = Number(info.durationInSeconds);

    const resp = await collection.insertOne(req.body);
    await categoryCollection.updateOne(
      { _id: hasCategory._id },
      { $set: { count: hasCategory.count++ } }
    );
    res.json(resp);
  }
);

router.put('/', [validate(s.updateVideo)], async (req, res) => {
  req.body.modifiedAt = new Date();
  if (req.body.time) req.body.time = Number(req.body.time);
  let _id = new objectId(req.body._id);
  const previousVideo = await collection.findOne({ _id: _id });
  if (!previousVideo) return errMsg(req, res, 'itemNotFound');
  if (req.body.category) {
    req.body.category = req.body.category.trim();
    let query = {
      title: {
        $regex: ['^', req.body.category, '$'].join(''),
        $options: '-i',
      },
    };
    const hasCategory = await categoryCollection.findOne(query);
    if (!hasCategory) return errMsg(req, res, 'categoryNotFound');
    if (previousVideo.category !== req.body.category) {
      await categoryCollection.updateOne(
        { _id: hasCategory._id },
        { $set: { count: hasCategory.count++ } }
      );
      await categoryCollection.updateOne(
        {
          title: {
            $regex: ['^', req.body.category, '$'].join(''),
            $options: '-i',
          },
        },
        { $set: { count: hasCategory.count-- } }
      );
    }
  }
  delete req.body._id;
  const resp = await collection.updateOne({ _id: _id }, { $set: { ...req.body } });
  return res.json(resp);
});

router.delete('/', [validate(s.deleteVideo)], async (req, res) => {
  const resp = await collection.deleteOne({ _id: new objectId(req.body._id) });
  res.json(resp);
});

module.exports = router;
