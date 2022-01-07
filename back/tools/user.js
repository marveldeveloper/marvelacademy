'use strict';
const objectId = require('mongodb').ObjectId;
const mongo = require('../startup/mongoUtil');
const collection = mongo.getCollection('users');
const termCollection = mongo.getCollection('terms');

const checkDuplicate = async (_id, data) => {
  let user = await collection.findOne({ _id: new objectId(_id) });
  if (data.phone && user.phone !== data.phone) {
    let exist = await collection.findOne({
      phone: {
        $regex: ['^', data.phone, '$'].join(''),
        $options: '-i',
      },
    });
    if (exist) return 'phoneExists';
  }

  return '';
};

const promoteStudent = async (userId, termId, sectionIndex, activityIndex) => {
  const user = await collection.findOne({ _id: new objectId(userId) });
  const term = await termCollection.findOne({ _id: new objectId(termId) });
  if (!term || !user) return;
  let userLevel =
    user.progress.lastTerm * 10000 +
    user.progress.lastSection * 100 +
    user.progress.lastActivity;
  let newLevel = term.index * 10000 + sectionIndex * 100 + activityIndex;
  if (userLevel > newLevel) return;
  let newProgress = {
    lastActivity: activityIndex,
    lastSection: sectionIndex,
    lastTerm: term.index,
  };
  console.log('activityCount', term.sections[sectionIndex].length);
  if (activityIndex + 1 >= term.sections[sectionIndex].length) {
    if (sectionIndex + 1 >= term.sections.length) {
      newProgress = {
        lastActivity: 0,
        lastSection: 0,
        lastTerm: term.index + 1,
      };
    } else {
      newProgress = {
        lastActivity: 0,
        lastSection: sectionIndex + 1,
        lastTerm: term.index,
      };
    }
  }
  await collection.updateOne(
    { _id: new objectId(userId) },
    { $set: { progress: newProgress } }
  );
};

module.exports = {
  checkDuplicate,
  promoteStudent,
};
