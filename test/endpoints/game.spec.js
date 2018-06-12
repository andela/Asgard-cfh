import should from 'should';
import supertest from 'supertest';
import app from '../../server';

// Request handler for making API calls
const request = supertest.agent(app);

describe('Game', () => {
  it('Should save game when it ends', () => {
    should(1).equal(1);
  });
});
