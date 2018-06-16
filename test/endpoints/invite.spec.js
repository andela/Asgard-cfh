import supertest from 'supertest';
import app from '../../server';

const request = supertest.agent(app);
let user;
const userEmail = `isaiah${Math.random() * 100}@andela.com`;

describe('POST to /invite', () => {
  before((done) => {
    request
      .post('/api/auth/signup')
      .send({
        name: 'Rotimi Yemitan',
        email: userEmail,
        password: 'password1234'
      })
      .end((err, res) => {
        user = res.body;
        user.active = true;
        done();
      });
  });
  it('Should send an invite successfully', (done) => {
    request
      .post('/api/invite')
      .send({
        gameURL: 'localhost:3000',
        recieverEmail: 'douglas@gmail.com',
        token: user.token
      })
      .end((err, res) => {
        res.body.message.should.equal('Email sent successfully');
        res.status.should.equal(200);
        done();
      });
  });
});

describe('Should be able to search users', () => {
  it('Should return user found', (done) => {
    request
      .post('/api/search')
      .send({
        term: userEmail,
      })
      .end((err, res) => {
        res.body.message.should.equal('Users Found');
        res.body.foundUser.should.be.eql([{
          email: userEmail,
          name: 'Rotimi Yemitan'
        }]);
        res.status.should.equal(200);
        done();
      });
  });

  it('Should return User not found', (done) => {
    request
      .post('/api/search')
      .send({
        term: 'cfgvhbjknlmknjbhvgfhvjbknlm',
      })
      .end((err, res) => {
        res.body.message.should.equal('User not found');
        res.status.should.equal(404);
        done();
      });
  });
});
