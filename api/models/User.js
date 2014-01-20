/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    oauth2token: {
      type: 'string',
      defaultsTo: ''
    },
    publicKey: {
      type: 'string',
      defaultsTo: ''
    },
  	firstName: 'string',
    lastName: 'string',
    friends: {
      type: 'array',
      defaultsTo: []
    },

    // runtime properties computed
  	fullName: function() {
      return this.firstName + ' ' + this.lastName;
    },
    phoneNumber: {
      type: 'string',
      defaultsTo: '111-222-3333'
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: 'string',

    // default overrides
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.oauth2token;
      return obj;
    },

    // lifecycle hooks
    beforeCreate: function(values, next) {
      // bcrypt.hash(values.password, 10, function(err, hash) {
      //   if(err) return next(err);
      //   values.password = hash;
      sails.log.info('hashing password');
      next();
      // });
    }
  }

};
