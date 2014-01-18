/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
module.exports = {

  attributes: {
    oauth2token: {
      type: 'string',
      defaultsTo: ''
    },
  	firstName: 'string',
    lastName: 'string',

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
