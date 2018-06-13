import should from 'should';
import supertest from 'supertest';
import app from '../../server';

const request = supertest.agent(app);

describe('POST to /invite', () => {
  it('Should send an invite successfully', (done) => {
    request
      .post('/invite')
      .send({
        gameURL: 'localhost:3000',
        recieverEmail: 'love@gmail.com',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk1Mjg5MzIxMzEsIl9pZCI6IjViMjA1NWEzNDc1NGFhMDVmYjBlZjc5OSIsImVtYWlsIjoiZG91Z2xhc2VnaWVtZWhAZ21haWwuY29tIiwiaWF0IjoxNTI4ODQ1NzMxfQ.gOaq1u2hgcz4Hv_HJ8p0knOPIuXe_9PkoRqW0oJXx8g'
      })
      .end((err, res) => {
        console.log(res);
        res.body.message.should.equal('Email sent successfully');
        res.status.should.equal(200);
        done();
      });
  });
});
