var fs = require('fs.extra');
/**
 * Bootstrap
 */

var Sails = require('sails');
var assert = require('assert');
    //Utils = require('./utils'),
    //Database = require('./database'),
    //localConf = require('../../config/local');
var request = require('supertest');

/**
 * Before ALL the test bootstrap the server
 */
 
var app;
 
before(function(done) {
  
  
  this.timeout(5000);
  
  // TODO: Create the database
  // Database.createDatabase.....
  if(fs.existsSync('.tmp/disk.db')) {
    fs.unlinkSync('.tmp/disk.db');
  }
  fs.copy('test/mockData.db', '.tmp/disk.db', function(err) {
    if(err) throw err;

    Sails.lift({
      log: {
        level: 'error'
      },
      adapters: {
        // mongo: {
        //   module: 'sails-mongo',
        //   host: 'localhost',
        //   database: 'test_database',
        //   user: '',
        //   pass: ''
        // }
      }
    }, function(err, sails) {
      app = sails;
      // finish loading the mock data
      done(err, sails);
    });
  });  
});

describe('User', function(done) {
  it("should return the already created users", function(done) {
    request(Sails.express.app)
      .get('/user')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        var users = res.body;
        assert(users.length === 4);
        assert(res.statusCode === 200);
        done();
      });
  });

  it('should be able to create a user and return the correct stuff', function(done) {
    request(Sails.express.app)
      .post('/user')
      .send({ email: 'e123@mail.com', password: 'asdf', firstName: 'Ed', lastName: 'Doe' })
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        assert.equal(res.body.password, undefined, 'Response should not contain the password that they sent');
        assert.equal(res.body.publicKey, '', 'Response should contain an empty publicKey (until they login)');
        assert.equal(res.body.oath2token, undefined, 'Response should not contain the token.');
        assert(res.statusCode === 201);
        done();
      });
  });
});

/**
 * After ALL the tests, lower sails
 */
 
after(function(done) {
 
  // TODO: Clean up db
  // Database.clean...
  fs.unlinkSync('.tmp/disk.db');
  app.lower(done);
  
 
});