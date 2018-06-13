import should from 'should';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../server';

require('dotenv').config();
// Request handler for making API calls
const request = supertest(app);
const Game = mongoose.model('Game');

const gameData = {
  gameId: 'E5TGR43',
  players: [
    'Ajiboye Daramola',
    'Clinton Fidelis',
    'Rotimi Isaiah',
  ],
  gameWinner: 'Rotimi Isaiah'
};

const gameData2 = {
  gameId: 'E5TGR46',
  players: [
    'Ajiboye Daramola',
    'Clinton Fidelis',
    'Rotimi Isaiah',
    'Fortune Ekeruo',
    'Douglas',
    'Olatunji'
  ],
  gameWinner: 'Rotimi Isaiah'
};

describe('Game', () => {
  before((done) => {
    const game = new Game({ gameId: 'E5TGR43' });
    game.save();
    done();
  });


  it('Should create game when it begins', (done) => {
    request.post('/api/games/E5TGR45/start')
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        should(res.body.message).be.eql('Game Created');
        done();
      });
  });

  it('Should not create game if it exists', (done) => {
    request.post('/api/games/E5TGR43/start')
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        should(res.body.message).be.eql('Game Exists');
        done();
      });
  });

  it('Should save game when it ends', (done) => {
    request.post('/api/game/save')
      .send(gameData)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        (res.body.message).should.be.eql('Game Saved');
        done();
      });
  });

  it('Should create and save game if it has 6 players', (done) => {
    request.post('/api/game/save')
      .send(gameData2)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        (res.body.message).should.be.eql('Game Saved');
        done();
      });
  });

  it('Should throw an error if gameId is not provided', (done) => {
    gameData2.gameId = '';
    request.post('/api/game/save')
      .send(gameData2)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        (res.body.message).should.be.eql('Please enter a gameId');
        done();
      });
  });

  after((done) => {
    mongoose.connection.db.dropCollection('games')
      .then(() => done());
  });
});
