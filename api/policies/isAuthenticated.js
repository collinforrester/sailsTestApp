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

	var authHeader = JSON.parse(req.headers.authorization);
	var theirHash = authHeader.hash;

	sails.log.info(req.url);

	var baseString = authHeader.ts + '\n' + authHeader.nonce + '\n' +
			req.method + '\n' + req.url.replace(/http:\/\/|https:\/\//, '') +
			'\n' + 'localhost' + '\n' + '1337' + '\n' + '\n';

	var publicKey = authHeader.publicKey;

	sails.log.info('their hash: ', theirHash);
	sails.log.info('base string:\n', baseString);
	sails.log.info(authHeader);

	//
	// User is allowed, proceed to the next policy,
	// or if this is the last policy, the controller
	User.findOne({publicKey: publicKey}).exec(function(err, User) {
		if (err) throw err;
		var nope = function() {
			return res.forbidden('You are not permitted to perform this action.');
		}
		if(User) {
			var myHash = cryptojs.HmacSHA1(baseString, User.oauth2token).toString(cryptojs.enc.Base64);
			sails.log.info('my hash: ' + myHash);
			sails.log.info('their hash: ' + theirHash);
			sails.log.info(User);
			if(myHash === theirHash) {
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