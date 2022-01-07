'use strict';

const u = require('util');
const fs = require('fs');
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');

const mongo = require('../../../startup/mongoUtil');
const listResult = require('../../../tools/listResult');
const validate = require('../../../middleware/validate');
const { errMsg, msg } = require('../../../tools/message');
const { randomString } = require('../../../tools/random');

const router = express.Router();
const multer = require('multer');
const { convertToJpeg } = require('../../../tools/video');
const { generateThumbnailFromVideo } = require('../../../tools/video');
const unlink = u.promisify(fs.unlink);
const collection = mongo.getCollection('files');
const termsCollection = mongo.getCollection('terms');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './contents/');
  },
  filename: (req, file, cb) => {
    const extension = /*(*/ file.originalname; /*.match(/\.+[\S]+$/) || [])[0]*/
    cb(null, randomString(24, true) + extension);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  let validTypes = [
    'image/jpeg',
    'image/png',
    'video/mp4',
    'application/pdf',
    'application/zip',
    'application/x-rar-compressed',
    'application/octet-stream',
  ];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const videoFilter = (req, file, cb) => {
  // reject a file
  let validTypes = [
    'video/mp4',
    'video/webm',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/zip',
    'application/x-rar-compressed',
    'application/octet-stream',
  ];
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

const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 32,
  },
  fileFilter: fileFilter,
});

router.get('/', validate(s.listFiles, 'query'), async (req, res) => {
  return listResult(req, res, ['files']);
});

router.post(
  '/',
  [fileUpload.fields([{ name: 'file', maxCount: 8 }]), validate(s.addFile)],
  async (req, res) => {
    let file = {};
    const term = await termsCollection.findOne({ _id: new objectId(req.body.termId) });
    if (!term) return errMsg(req, res, 'termNotFound');
    const sectionIndex = Number(req.body.sectionIndex);
    const activityIndex = Number(req.body.activityIndex);
    if (!term.sections[sectionIndex]) return errMsg(req, res, 'termNotFound');
    if (!term.sections[sectionIndex][activityIndex])
      return errMsg(req, res, 'termNotFound');
    const activityType = term.sections[sectionIndex][activityIndex].type;

    if (activityType === 'video' && activityType !== 'exam')
      return errMsg(req, res, 'activityVideo');
    if (!req.files) {
      if (!req.body.paths) return errMsg(req, res, 'fileRequired');
      file = {
        paths: req.body.paths,
        createdAt: new Date(),
        termId: new objectId(req.body.termId),
        sectionIndex: Number(req.body.sectionIndex),
        activityIndex: Number(req.body.activityIndex),
        deleted: false,
      };
    } else {
      if (!req.files.file) return errMsg(req, res, 'fileRequired');
      file = {
        paths: req.files.file?.map((item) => item.path),
        createdAt: new Date(),
        termId: new objectId(req.body.termId),
        sectionIndex: Number(req.body.sectionIndex),
        activityIndex: Number(req.body.activityIndex),
        deleted: false,
      };
    }

    const oldFile = await collection.findOne({
      termId: new objectId(req.body.termId),
      sectionIndex: Number(req.body.sectionIndex),
      activityIndex: Number(req.body.activityIndex),
    });
    if (oldFile) {
      await collection.deleteOne({ _id: oldFile._id });
      oldFile.paths?.map((item) => {
        unlink(item).catch((e) => e);
      });
      if (oldFile.thumbnail) unlink(oldFile.thumbnail).catch((e) => e);
      if (oldFile.video) unlink(oldFile.video).catch((e) => e);
    }
    const resp = await collection.insertOne(file);
    if (term.sections[sectionIndex])
      if (term.sections[sectionIndex][activityIndex])
        term.sections[sectionIndex][activityIndex].files = file;
    await termsCollection.updateOne({ _id: term._id }, { $set: { ...term } });
    return res.json(resp);
  }
);

router.post(
  '/video',
  [
    videoUpload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'file', maxCount: 8 },
    ]),
    validate(s.addVideo),
  ],
  async (req, res) => {
    console.log(req.files?.file);
    const term = await termsCollection.findOne({ _id: new objectId(req.body.termId) });
    if (!term) return errMsg(req, res, 'termNotFound');
    const sectionIndex = Number(req.body.sectionIndex);
    const activityIndex = Number(req.body.activityIndex);
    if (!term.sections[sectionIndex]) return errMsg(req, res, 'termNotFound');
    if (!term.sections[sectionIndex][activityIndex])
      return errMsg(req, res, 'termNotFound');
    let file = {};

    const activityType = term.sections[sectionIndex][activityIndex].type;
    if (activityType !== 'video' && activityType !== 'exam')
      return errMsg(req, res, 'activityNotVideo');
    if (!req.files?.video && !req.files?.thumbnail && !req.files?.file)
      if (!req.body.paths && !req.body.video && !req.body.thumbnail)
        return errMsg(req, res, 'fileRequired');

    let videoPath = req.files?.video.map((item) => item.path)[0];
    let thumbPath;
    if (!req.body.thumbnail) {
      if (videoPath) {
        if (!req.files?.thumbnail) {
          thumbPath = await generateThumbnailFromVideo(videoPath);
          // req.body.preview = await generateGifFromVideo(videoPath);
        } else {
          thumbPath = req.files.thumbnail.map((item) => item.path)[0];
          thumbPath = await convertToJpeg(thumbPath, false, 512, 'contents', false);
        }
      }
    }
    file = {
      paths: req.files?.file ? req.files.file.map((item) => item.path) : req.body.paths,
      video: videoPath ? videoPath : req.body.video,
      thumbnail: thumbPath ? thumbPath : req.body.thumbnail,
      createdAt: new Date(),
      termId: term._id,
      sectionIndex: sectionIndex,
      activityIndex: activityIndex,
      deleted: false,
    };

    const oldFile = await collection.findOne({
      termId: term._id,
      sectionIndex: sectionIndex,
      activityIndex: activityIndex,
    });
    if (oldFile) {
      await collection.deleteOne({ _id: oldFile._id });
      if (!req.files?.file && !req.body.paths) {
        file.paths = oldFile.paths;
      } else {
        oldFile.paths?.map((item) => {
          unlink(item).catch((e) => e);
        });
      }
      if (!req.files?.video && !req.body.video) {
        file.video = oldFile.video;
      } else {
        if (oldFile.video) unlink(oldFile.video).catch((e) => e);
      }
      if (!req.files?.thumbnail && !req.body.thumbnail) {
        file.thumbnail = oldFile.thumbnail;
      } else {
        if (oldFile.thumbnail) unlink(oldFile.thumbnail).catch((e) => e);
      }
    }
    const resp = await collection.insertOne(file);
    if (term.sections[sectionIndex])
      if (term.sections[sectionIndex][activityIndex])
        term.sections[sectionIndex][activityIndex].files = file;
    await termsCollection.updateOne({ _id: term._id }, { $set: { ...term } });
    return res.json(resp);
  }
);

router.delete('/', validate(s.deleteFile), async (req, res) => {
  const file = await collection.findOne({ _id: new objectId(req.body._id) });
  if (!file) errMsg(req, res, 'itemNotFound');
  file.paths?.map((item) => unlink(item).catch((e) => e));
  if (file.thumbnail) unlink(file.thumbnail).catch((e) => e);
  if (file.video) unlink(file.video).catch((e) => e);
  const result = await collection.deleteOne({ _id: new objectId(req.body._id) });
  const term = await termsCollection.findOne({ termId: file._id });
  if (term.sections[file.sectionIndex])
    delete term.sections[file.sectionIndex][file.activityIndex].files;
  await termsCollection.updateOne({ termId: file._id }, term);
  return res.json(result);
});

module.exports = router;
