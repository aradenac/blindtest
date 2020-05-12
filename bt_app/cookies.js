const base64url = require('base64url')

function encode(obj) {
  return base64url.encode(JSON.stringify(obj));
}

function decode(str) {
  return JSON.parse(base64url.decode(str));
}

module.exports = {encode, decode};
