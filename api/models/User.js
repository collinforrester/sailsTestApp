/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
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
      required: true
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
      console.log('hashing password');
      console.log(values);
      next();
      // });
    }
  }

};
