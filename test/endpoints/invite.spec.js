import supertest from 'supertest';
import app from '../../server';

const request = supertest.agent(app);

describe('POST to /invite', () => {
  it('Should send an invite successfully', (done) => {
    request
      .post('/api/invite')
      .send({
        gameURL: 'localhost:3000',
        recieverEmail: 'douglas@gmail.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk1Mjg5MzIxMzEsIl9pZCI6IjViMjA1NWEzNDc1NGFhMDVmYjBlZjc5OSIsImVtYWlsIjoiZG91Z2xhc2VnaWVtZWhAZ21haWwuY29tIiwiaWF0IjoxNTI4ODQ1NzMxfQ.gOaq1u2hgcz4Hv_HJ8p0knOPIuXe_9PkoRqW0oJXx8g'
      })
      .end((err, res) => {
        res.body.message.should.equal('Email sent successfully');
        res.status.should.equal(200);
        done();
      });
  });
});

describe('get to /search', () => {
  it('Should search users', (done) => {
    request
      .post('/api/search')
      .send({
        term: '',
      })
      .end((err, res) => {
        res.body.message.should.equal('Users Found');
        res.status.should.equal(200);
        done();
      });
  });
});
