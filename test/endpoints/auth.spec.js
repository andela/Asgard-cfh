import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';

let token;
const token2 = 'hjbjbjbfjbjbjhfbhbvbrjbbhjbhyurrhbub4urghubjbhbrbjruybhb';

// Request handler for making API calls
const request = supertest(app);

describe('Authentication', () => {
  describe('Signup', () => {
    it('should create a new User', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'Fidelis clinton',
          email: 'clint@example.com',
          password: 'clint2016'
        })
        .expect(201)
        .end((err, res) => {
          token = res.body.token;
          if (err) {
            return done(err);
          }
          (res.body.message).should.be.eql('Signed up successfully, please check email for activation link');
          done();
        });
    });
  });

  describe('confirmEmail', () => {
    it('Should fail if activation link is expired', (done) => {
      request
        .get(`/activate/${token2}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          (res.body.message).should.be.eql('Activation link has expired');
          done();
        });
    });
  });

  describe('confirmEmail', () => {
    it('confirm users email', (done) => {
      request
        .get(`/activate/${token}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          (res.status).should.be.eql(302);
          done();
        });
    });
  });

  describe('Login', () => {
    it('should log in an existing user', (done) => {
      request
        .post('/api/auth/login')
        .send({
          email: 'clint@example.com',
          password: 'clint2016',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          (res.body.message).should.be.eql('Logged in Successfully');
          should(res.body).have.property('token');
          done();
        });
    });
  });

  after((done) => {
    mongoose.connection.db.dropCollection('users')
      .then(() => done());
  });
});
