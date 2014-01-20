/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {



	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to UserController)
	 */
	_config: {},
	'new': function(req, res) {
		return res.view();
	},
	info: function(req, res) {
		res.json({secret: 'The Chiefs suck.'});
	},
	find: function(req, res) {
		if(req.params.id) {
			User.findOne({id: req.params.id}).exec(function(err, user) {
				if (err) throw err;
				sails.log.info('returned user ', user);
				var whereClause = user.friends ? user.friends.map(function(id) { return {id: id }; }) : [];
				sails.log.info(whereClause);
				User.find().where({ or: whereClause }).exec(function(err, users) {
					if(err) throw err;

					user.friends = users;
					return res.json(user);
				});
			});
		} else {
			User.find().exec(function(err, user) {
				if(err) throw err;

				return res.json(user);
			});
		}
	},
	login: function(req, res) {
		var email = req.query.email;
		var password = req.query.password;
		sails.log.info('Attempting to login with: ', email, password);
		User.findOne({
			email: email
		}).exec(function(err, User) {
			if (err) throw err;

			// check username and password
			if(email === 'collin.forrester@gmail.com' && password === 'asdf') {
				User.oauth2token = 'somethingspecial123';
				User.publicKey = 'asdf1234';
				User.save(function(err) {
					if(err) throw err;

					return res.json({
						status: 'ok',
						user: User
					});
				});
			} else {
				return res.json({
						status: 'ok'
					});
			}
		});
	}

};