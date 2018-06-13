import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';

const User = mongoose.model('User');

// Request handler for making API calls
const request = supertest.agent(app);

describe('Authentication', () => {
  describe('Test for signup with an invalid password', () => {
    it('Should flag invalid password errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'tajudeen',
          email: 'were@taju.com',
          password: 'qq'
        })
        .end((err, res) => {
          should(res.body.errors[0].msg).equal('passwords must be at least 6 chars long and contain one number');
          should(res.status).equal(422);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Test for signup with an invalid name', () => {
    it('Should flag invalid name errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'q',
          email: 'were@taju.com',
          password: 'qq11ggttre'
        })
        .end((err, res) => {
          should(res.body.errors[0].msg).equal('name must be a minimum of two letters');
          should(res.status).equal(422);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Test for signup with an invalid email', () => {
    it('Should flag invalid email errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'tajudeen',
          email: 'com',
          password: 'hgfh64gt45qq'
        })
        .end((err, res) => {
          should(res.body.errors[0].msg).equal('please enter a valid email');
          should(res.status).equal(422);
          if (err) return done(err);
          done();
        });
    });
  });

  describe('Test for signup with an existing email', () => {
    it('Should flag duplicate email errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'tajudeen',
          email: 'olatunjiyso@gmail.com',
          password: 'hgfh64gt45qq'
        })
        .end((err, res) => {
          should(res.body.message).equal('this email is in use already');
          should(res.status).equal(409);
          if (err) return done(err);
          done();
        });
    });
  });
});
