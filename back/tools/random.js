'use strict';
const randomNumber = (length) => {
  let result = '';
  let characters = '0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const randomString = (length, add_time = false) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  if (add_time) {
    let t = Date.now();
    while (t > 0) {
      result += characters.charAt(t % charactersLength);
      t = Math.floor(t / charactersLength);
    }
    length -= result.length;
  }
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  randomNumber,
  randomString,
};
