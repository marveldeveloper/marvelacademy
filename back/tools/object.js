'use strict';

const deepCopy = (data) => {
  return JSON.parse(JSON.stringify(data));
};

module.exports = {
  deepCopy,
};
