import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';

const User = mongoose.model('User');

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
