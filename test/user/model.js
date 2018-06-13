/**
 * Module dependencies.
 */
require('../../server');
const should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');
require('dotenv').config();

// Globals
let user = new User({
  name: 'Full name',
  email: 'test@test.com',
  username: 'user',
  password: 'password'
});

// The tests
describe('<Unit Test>', () => {
  describe('Model User:', () => {
    describe('Method Save', () => {
      it('should be able to save whithout problems', done => user.save((err) => {
        should.not.exist(err);
        done();
      }));

      it('should be able to show an error when try to save witout name', (done) => {
        user = new User({
          name: '',
          email: 'test@test.com',
          username: 'user',
          password: 'password'
        });
        return user.save((err) => {
          should.exist(err);
          done();
        });
      });
    });
  });
});
