/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  Game = mongoose.model('Game'),
  User = mongoose.model('User'),
  gameHelper = require('../helpers/gameHelper');

/**
   * @description - Saves the Game After Game Ends
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   * @return {Object} - Success message
   *
   * ROUTE: POST: /api/game/save
   */
exports.saveGame = (req, res) => {
  if (req.body.gameId) {
    Game.findOne({ gameId: req.body.gameId })
      .exec((err, game) => {
        if (err) return res.status(500).json({ message: 'An error occured' });
        if (!game && req.body.players.length < 12) return res.status(404).json({ message: 'Game not found' });
        if (!game && req.body.players.length === 12) {
          const newGame = new Game(req.body);
          newGame.save((err) => {
            if (err) return err;
            return res.status(200).json({ message: 'Game Saved', game });
          });
        } else {
          game.gameId = req.body.gameId;
          game.players = req.body.players;
          game.gameWinner = req.body.gameWinner;
          game.roundsPlayed = req.body.roundsPlayed;

          game.save((err) => {
            if (err) {
              return res.status(500).json({ error: err.errors });
            }
            return res.status(200).json({ message: 'Game Saved', game });
          });
        }
      });
  } else {
    return res.status(400).json({ message: 'Please enter a gameId' });
  }
};

/**
   * @description - Create the Game At the Beginning of the Game
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   * @return {Object} - Success message
   *
   * ROUTE: POST: /api/game/:id/start
   */
exports.startGame = (req, res) => {
  if (req.params.id) {
    Game.findOne({ gameId: req.params.id })
      .exec((err, game) => {
        if (err) return res.status(500).json({ message: 'An error occured' });
        if (!game) {
          const gameDetails = {
            gameId: req.params.id
          };
          const newGame = new Game(gameDetails);
          newGame.save((err) => {
            if (err) {
              return res.status(500).json({ error: err.errors });
            }
            return res.status(201).json({ message: 'Game Created', newGame });
          });
        } else if (game) {
          return res.status(400).json({ message: 'Game Exists' });
        }
      });
  } else {
    return res.status(400).json({ message: 'Game Id Missing' });
  }
};

/**
   * @description - Generates games history for users
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   * @return {Object} - Success message
   *
   * ROUTE: POST: /api/gameHistory
   */
exports.gameHistory = (req, res) => {
  Game.find().exec((err, games) => {
    if (err) {
      return res.status(500).json({ message: 'An Error Occurred' });
    }
    if (!games) {
      return res.status(404).json({ message: 'No Games Played' });
    }
    const gameLog = games.filter(game => game.players.length !== 0);
    return res.status(200).json(gameLog);
  });
};

/**
   * @description - Generate leaderboard info for users
   *
   * @param  {object} req - request
   *
   * @param  {object} res - response
   *
   * @return {Object} - Success message
   *
   * ROUTE: POST: /api/leaderboard
   */
exports.leaderBoard = (req, res) => {
  User.find()
    .select('name')
    .exec((err, users) => {
      if (err) return err;
      if (!users) {
        return res.status(404).json({ message: 'Users not found' });
      }
      Game.find().exec((err, games) => {
        if (err) return err;
        if (!games) {
          return res.status(404).json({ message: 'Games not Found' });
        }
        const leaderBoard = gameHelper.getLeaderBoard(users, games);
        return res.status(200).json(leaderBoard);
      });
    });
};
