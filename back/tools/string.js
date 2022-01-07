'use strict';
const persianNum = [/۰/gi, /۱/gi, /۲/gi, /۳/gi, /۴/gi, /۵/gi, /۶/gi, /۷/gi, /۸/gi, /۹/gi];

const num2en = (str) => {
  for (let i = 0; i < 10; i++) {
    str = str.replace(persianNum[i], i);
  }
  return str;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const parse = (str, args) => {
  let i = 0;
  return str.replace(/%s/g, () => args[i++] || '');
};

module.exports = {
  capitalize,
  num2en,
  parse,
};
