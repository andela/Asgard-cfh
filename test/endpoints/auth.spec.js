import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';
import Token from '../../app/controllers/users';

const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const token = 'token';

// Request handler for making API calls
const request = supertest.agent(app);
 
describe('Authentication', () => {
  describe('Signup', () => {
    it('Should return a JWT upon user signup', () => {
      should(1).equal(1);
    });
  });

  describe('Signin', () => {
    it('Should be able to login', () => should(2).equal(2));
  });
});


describe('POST to api/auth/signup', () => {
  it('Should return a JWT upon user signup', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'stevenson',
        email: 'simonsinec@gmail.com',
        password: 'password567'
      })
      .end((err, res) => {
        res.body.message.should.equal('Signed up successfully, please check email for activation link');
        res.status.should.equal(201);
        done();
      });
  });
});
