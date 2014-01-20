var cryptojs = require('crypto-js');

/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	var nope = function(details) {
		return res.forbidden('You are not permitted to perform this action.' + (!!details ? details : ''));
	}
  // Request are signed like
  // TS
  // NONCE
  // METHOD
  // RESOURCE
  // HOST
  // PORT

  // Example
  // 123456
  // 1
  // GET
  // /user/info
  // localhost
  // 1337

  // take that information ^^^ and hash the token that you were once given with hmac-sha1 after
  // you encode it.

  if(!req.headers.authorization) {
    return nope('  Missing Authorization header.');
  }

  var authHeaderArr = req.headers.authorization.split(',');
  var authHeader = {};
  for(var i = 0; i < authHeaderArr.length; i++) {
    var parts = authHeaderArr[i].split('=');
    parts = [parts.shift(), parts.join('=')]; // handles '=' chars being in hash and splitting on them
    authHeader[parts[0]] = parts[1];
  }
  if(!authHeader.hash || !authHeader.publicKey || !authHeader.ts || !authHeader.nonce) {
    return nope('  Missing "hash", "publicKey", "ts", or "nonce".');
  }

  var baseString = authHeader.ts + '\n' + authHeader.nonce + '\n' +
      req.method + '\n' + req.url.replace(/http:\/\/|https:\/\//, '') +
      '\n' + req.get('host').split(':')[0] + '\n' + (req.get('host').split(':')[1] || (req.protocol === 'http' ? '80' : '443')) + '\n' + '\n';

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  User.findOne({publicKey: authHeader.publicKey}).exec(function(err, User) {
    if (err) throw err;
		if(User) {
			var myHash = cryptojs.HmacSHA1(require('btoa')(baseString), User.oauth2token).toString(cryptojs.enc.Base64);
			if(myHash === authHeader.hash) {
				return next();
			} else {
				return nope();
			}
		} else {
			// User is not allowed
			// (default res.forbidden() behavior can be overridden in `config/403.js`)
			return nope();
		}
	});

};