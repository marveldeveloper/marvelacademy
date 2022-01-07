'use strict';
const c = require('config');
const MongoClient = require('mongodb').MongoClient;

const url = `mongodb://${c.get('mongAddress')}:${c.get('mongPort')}/`;
var _db;

module.exports = {
  connectToServer: (callback) => {
    MongoClient.connect(url, (err, client) => {
      _db = client.db(c.get('mongName'));
      return callback(err);
    });
  },

  getCollection: (collectionName) => {
    return _db.collection(collectionName);
  },
};
