var base64url = require('base64url');

function eCookie(obj) {
  return base64url.encode(JSON.stringify(obj));
}

function dCookie(str) {
  return JSON.parse(base64url.decode(str));
}

module.exports = {eCookie, dCookie};
