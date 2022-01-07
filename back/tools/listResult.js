'use strict';
const c = require('config');
const mongo = require('../startup/mongoUtil');

const getSort = (req) => {
  let sortArgs = req.query.sort || null;
  if (sortArgs) {
    sortArgs = sortArgs.split(',');
    let sortBy = {};
    for (let i in sortArgs) {
      let item = sortArgs[i].split(':');
      sortBy[item[0]] = parseInt(item[1]);
    }
    return { $sort: sortBy };
  }
  return null;
};

const getPages = (req) => {
  let maxPerPage = c.get('maxPerPage');
  let perPage = parseInt(req.query.perPage) || maxPerPage;
  perPage = maxPerPage > perPage ? perPage : maxPerPage;
  perPage = 1 > perPage ? 1 : perPage;
  let page = parseInt(req.query.page) || 1;
  return {
    $facet: {
      pages: [{ $count: 'totalItems' }, { $addFields: { page: page, perPage: perPage } }],
      data: [{ $skip: (page - 1) * perPage }, { $limit: perPage }],
    },
  };
};

const getDate = (date) => {
  if (!date) return null;
  return new Date(date);
};

const addQueryParams = (req, query) => {
  let status = req.query.status || null;
  let startDate = getDate(req.query.startDate || null);
  let endDate = getDate(req.query.endDate || null);
  if (!query) query = {};
  if (startDate || endDate) query.createdAt = {};
  if (startDate) query.createdAt['$gte'] = startDate;
  if (endDate) query.createdAt['$lte'] = endDate;
  if (status) query.status = status;
};

const addFilter = (req, query, searchFields) => {
  let search = req.query.search || null;
  let regex = null;
  if (search) {
    regex = { $regex: `${search}.*`, $options: '-i' };
    if (searchFields) {
      query['$or'] = '$or' in query ? query['$or'] : [];
      searchFields.forEach((searchField) => {
        let temp = {};
        temp[searchField] = regex;
        query['$or'].push(temp);
      });
    }
  }
};

const getMatch = (req, query, searchFields) => {
  addQueryParams(req, query);
  addFilter(req, query, searchFields);
  if (query && Object.keys(query).length > 0) return { $match: query };
  return null;
};

const getProjection = (projection) => {
  if (projection && Object.keys(projection).length > 0) return { $project: projection };
};

const updatePipeline = (pipeline, data) => {
  if (!data) return;
  if (Array.isArray(data)) {
    if (data.length == 0) return;
    pipeline.push(...data);
    return;
  }
  if (typeof data === 'object') {
    if (Object.keys(data).length == 0) return;
    pipeline.push(data);
    return;
  }
};

const listResult = async (req, res, queryParamiters) => {
  for (let i = 0; i < 4 - queryParamiters.length; i++) queryParamiters.push(null);
  let [collection, query, projection, searchFields] = queryParamiters;
  let pipeline = [];
  updatePipeline(pipeline, getMatch(req, query, searchFields));
  updatePipeline(pipeline, getProjection(projection));
  updatePipeline(pipeline, getSort(req));
  updatePipeline(pipeline, getPages(req));
  collection = mongo.getCollection(collection);
  let result = await collection.aggregate(pipeline).toArray();
  if (result && result.length) {
    result = result[0];
    if (result.pages.length) {
      result.pages = result.pages[0];
      result.pages.totalPages = Math.ceil(result.pages.totalItems / result.pages.perPage);
    }
  }
  return res.json(result);
};

module.exports = listResult;
