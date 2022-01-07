'use strict';
const u = require('util');
const fs = require('fs');
const express = require('express');
const objectId = require('mongodb').ObjectId;

const s = require('./schema');

const mongo = require('../../startup/mongoUtil');
const listResult = require('../../tools/listResult');
const validate = require('../../middleware/validate');
const { errMsg, msg } = require('../../tools/message');
const { randomString } = require('../../tools/random');
const auth = require('../../middleware/auth');

const router = express.Router();
const multer = require('multer');
const unlink = u.promisify(fs.unlink);
const collection = mongo.getCollection('homeworks');
const termsCollection = mongo.getCollection('terms');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './homeworks/');
  },
  filename: (req, file, cb) => {
    const extension = (file.originalname.match(/\.+[\S]+$/) || [])[0];
    cb(null, randomString(32, true) + extension);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  let validTypes = [
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter: fileFilter,
});

router.get('/', [auth, validate(s.listFiles, 'query')], async (req, res) => {
  //TODO:edit aggregate function to support all kinds of grouping
  const result = await collection
    .aggregate([
      { $match: { userId: objectId(req.user._id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'terms',
          localField: 'termId',
          foreignField: '_id',
          as: 'terms',
        },
      },
      { $unwind: '$terms' },
      // { $sort: { 'terms.index': 1 } },
      {
        $group: {
          _id: '$termId',
          termIndex: { $first: '$terms.index' },
          data: {
            $push: {
              termIndex: '$terms.index',
              homework: {
                _id: '$_id',
                path: '$path',
                status: '$status',
                comment: '$comment',
                createdAt: '$createdAt',
                activity: {
                  $arrayElemAt: [
                    { $arrayElemAt: ['$terms.sections', '$sectionIndex'] },
                    '$activityIndex',
                  ],
                },
                sectionIndex: '$sectionIndex',
                activityIndex: '$activityIndex',
              },
            },
          },
        },
      },
    ])
    .toArray();
  const filteredResult = result.map((i) => {
    return {
      ...i,
      data: i.data.map((j) => {
        const act = {...j.homework.activity};
        delete j.homework.activity;
        return {
          ...j,
          homework: {...j.homework,title: act.title}
        };
      }),
    };
  });
  return res.json(filteredResult);
});

router.post('/', [auth, upload.single('file'), validate(s.addFile)], async (req, res) => {
  if (!req.file) return errMsg(req, res, 'fileRequired');
  const term = await termsCollection.findOne({ _id: new objectId(req.body.termId) });
  if (!term) return errMsg(req, res, 'termNotFound');
  const sectionIndex = Number(req.body.sectionIndex);
  // return res.json(req.body);
  const activityIndex = Number(req.body.activityIndex);
  if (!term.sections[sectionIndex]) return errMsg(req, res, 'notHomework');
  if (!term.sections[sectionIndex][activityIndex]) return errMsg(req, res, 'notHomework');
  if (term.sections[sectionIndex][activityIndex].type !== 'homework')
    return errMsg(req, res, 'notHomework');

  let file = {
    path: req.file.path,
    createdAt: new Date(),
    userId: new objectId(req.user._id),
    termId: new objectId(req.body.termId),
    sectionIndex: sectionIndex,
    activityIndex: activityIndex,
    status: 'unknown',
    deleted: false,
  };
  const oldFile = await collection.findOne({
    userId: new objectId(req.user._id),
    termId: new objectId(req.body.termId),
    sectionIndex: sectionIndex,
    activityIndex: activityIndex,
  });
  if (oldFile) {
    await collection.deleteOne({ _id: oldFile._id });
    unlink(oldFile.path).catch();
  }
  const resp = await collection.insertOne(file);
  return res.json(resp);
});

router.delete('/', validate(s.deleteFile), async (req, res) => {
  const file = await collection.findOne({ _id: new objectId(req.body._id) });
  if (file.status !== 'unknown') return errMsg(req, res, 'itemNotFound');
  await unlink(file.path);
  const result = await collection.deleteOne({ _id: new objectId(req.body._id) });
  return res.json(result);
});

module.exports = router;
