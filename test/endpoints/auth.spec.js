import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';

const User = mongoose.model('User');
const user = new User({
  name: 'Test name',
  email: 'user@test.com',
  username: 'usertest',
  password: 'pass55',
  active: true
});

// Request handler for making API calls
const request = supertest.agent(app);

let token;
const token2 = 'hjbjbjbfjbjbjhfbhbvbrjbbhjbhyurrhbub4urghubjbhbrbjruybhb';

describe('Authentication', () => {
  before((done) => {
    user.save((err) => {
      if (err) return done(err);
    });
    done();
  });

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

    it('Should flag invalid password errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'tajudeen',
          email: 'were@taju.com',
          password: 'qq'
        })
        .end((err, res) => {
          if (err) return done(err);
          should(res.body.errors[0].msg).equal('passwords must be at least 6 chars long and contain one number');
          should(res.status).equal(422);
          done();
        });
    });

    it('Should flag invalid name errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'q',
          email: 'were@taju.com',
          password: 'qq11ggttre'
        })
        .end((err, res) => {
          if (err) return done(err);
          should(res.body.errors[0].msg).equal('name must be a minimum of two letters');
          should(res.status).equal(422);
          done();
        });
    });

    it('Should flag invalid email errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'tajudeen',
          email: 'com',
          password: 'hgfh64gt45qq'
        })
        .end((err, res) => {
          if (err) return done(err);
          should(res.body.errors[0].msg).equal('please enter a valid email');
          should(res.status).equal(422);
          done();
        });
    });

    it('Should flag duplicate email errors', (done) => {
      request
        .post('/api/auth/signup')
        .send({
          name: 'Fidelis clinton',
          email: 'clint@example.com',
          password: 'clint2016'
        })
        .end((err, res) => {
          if (err) return done(err);
          should(res.body.message).equal('this email is in use already');
          should(res.status).equal(409);
          done();
        });
    });
  });
  describe('Signin', () => {
    it('should return a JWT when a user is logged in successfully', (done) => {
      request
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'pass55'
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
