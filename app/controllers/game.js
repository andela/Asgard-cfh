/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  Game = mongoose.model('Game');

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
        if (!game) return res.status(404).json({ message: 'Game not found' });
        game.gameId = req.body.gameId;
        game.players = req.body.players;
        game.gameWinner = req.body.gameWinner;

        game.save((err) => {
          if (err) {
            return res.status(500).json({ error: err.errors });
          }
          return res.status(200).json({ message: 'Game Saved', game });
        });
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
            return res.status(200).json({ message: 'Game Created', newGame });
          });
        } else {
          return res.status(304).json({ message: 'Game Exists' });
        }
      });
  } else {
    return res.status(400).json({ message: 'Game Id Missing' });
  }
};
