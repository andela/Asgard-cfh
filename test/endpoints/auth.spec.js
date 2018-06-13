import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';


const User = mongoose.model('User');

// Request handler for making API calls
const request = supertest.agent(app);
const userEmail = `steve${Math.random() * 100}@andela.com`;

describe('POST to api/auth/signup', () => {
  it('Should return a JWT upon user signup', (done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'Clinton',
        email: userEmail,
        password: 'password1234'
      })
      .end((err, res) => {
        res.body.message.should.equal('Signed up successfully, please check email for activation link');
        should(res.body).have.property('token');
        should.exist(res.body.token);
        res.status.should.equal(201);
        done();
      });
  });
});
