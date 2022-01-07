'use strict';
const c = require('config');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient(
  `redis://${c.get('redisAddress')}:${c.get('redisPort')}`
);

module.exports = {
  ...client,
  incrby: promisify(client.incrby).bind(client),

  ttl: promisify(client.ttl).bind(client),

  get: promisify(client.get).bind(client),
  mget: promisify(client.mget).bind(client),
  set: promisify(client.set).bind(client),
  incr: promisify(client.incr).bind(client),
  keys: promisify(client.keys).bind(client),
  del: promisify(client.del).bind(client),

  zadd: promisify(client.zadd).bind(client),
  zrem: promisify(client.zrem).bind(client),
  zrank: promisify(client.zrank).bind(client),
  zcount: promisify(client.zcount).bind(client),
  zrange: promisify(client.zrange).bind(client),
  zscore: promisify(client.zscore).bind(client),
  zincrby: promisify(client.zincrby).bind(client),
  zremrangebyscore: promisify(client.zremrangebyscore).bind(client),
  zremrangebyrank: promisify(client.zremrangebyrank).bind(client),

  sadd: promisify(client.sadd).bind(client),
  srem: promisify(client.srem).bind(client),
  scard: promisify(client.scard).bind(client),
  sismember: promisify(client.sismember).bind(client),

  lset: promisify(client.lset).bind(client),
  lrem: promisify(client.lrem).bind(client),
  lpop: promisify(client.lpop).bind(client),
  lpush: promisify(client.lpush).bind(client),
  lrange: promisify(client.lrange).bind(client),
  rpop: promisify(client.rpop).bind(client),
  rpush: promisify(client.rpush).bind(client),
};
