const Game = require('./game');
const Player = require('./player');
require('console-stamp')(console, 'm/dd HH:MM:ss');
const mongoose = require('mongoose');

const User = mongoose.model('User');

const avatars = require(__dirname + '/../../app/controllers/avatars.js').all(); // eslint-disable-line 
// Valid characters to use to generate random private game IDs
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'; // eslint-disable-line 

module.exports = function(io) { // eslint-disable-line 

  // let game;
  const allGames = {};
  const allPlayers = {};
  const gamesNeedingPlayers = [];
  let gameID = 0;


  const createGameWithFriends = function(player,socket) {  // eslint-disable-line 
    let isUniqueRoom = false;
    let uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (let i = 0; i < 6; i++) {
        uniqueRoom += chars[Math.floor(Math.random() * chars.length)];
      }
      if (!allGames[uniqueRoom] && !(/^\d+$/).test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    console.log(socket.id, 'has created unique game', uniqueRoom);
    const game = new Game(uniqueRoom, io); // eslint-disable-line 
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  const fireGame = function(player, socket) { // eslint-disable-line 
    let game; // eslint-disable-line 
    if (gamesNeedingPlayers.length <= 0) {
      gameID += 1;
      const gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      console.log(socket.id, 'has joined newly created game', game.gameID);
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      game = gamesNeedingPlayers[0]; // eslint-disable-line 
      allPlayers[socket.id] = true;
      game.players.push(player);
      console.log(socket.id, 'has joined game', game.gameID);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(player.username+' has joined the game!'); // eslint-disable-line 
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.shift();
        game.prepareGame();
      }
    }
  };
  const getGame = function(player,socket,requestedGameId,createPrivate) { // eslint-disable-line 
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    console.log(socket.id, 'is requesting room', requestedGameId);
    if (requestedGameId.length && allGames[requestedGameId]) {
      console.log('Room', requestedGameId, 'is valid');
      const game = allGames[requestedGameId]; // eslint-disable-line 
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (game.state === 'awaiting players' && (!game.players.length ||
        game.players[0].socket.id !== socket.id)) {
        // Put player into the requested game
        console.log('Allowing player to join', requestedGameId);
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(`${player.username} has joined the game!`);
        if (game.players.length >= game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
          game.prepareGame();
        }
      } else {
        // TODO: Send an error message back to this user saying the game has already started
      }
    } else {
      // Put players into the general queue
      console.log('Redirecting player', socket.id, 'to general queue');
      if (createPrivate) {
        createGameWithFriends(player, socket);
      } else {
        fireGame(player, socket);
      }
    }
  };

  const joinGame = function(socket, data) { // eslint-disable-line 
    const player = new Player(socket);
    data = data || {};
    player.userID = data.userID || 'unauthenticated';
    if (data.userID !== 'unauthenticated') {
      User.findOne({
        _id: data.userID
      }).exec(function (err, user) { // eslint-disable-line 
        if (err) {
          console.log('err', err);
          return err; // Hopefully this never happens.
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
        } else {
          player.username = user.name;
          player.premium = user.premium || 0;
          player.avatar = user.avatar || avatars[Math.floor(Math.random() * 4) + 12];
          player.profileImage = user.profileImage;
        }
        getGame(player, socket, data.room, data.createPrivate);
      });
    } else {
      // If the user isn't authenticated (guest)
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
      getGame(player, socket, data.room, data.createPrivate);
    }
  };
  const exitGame = function(socket) { // eslint-disable-line 
    console.log(socket.id, 'has disconnected');
    if (allGames[socket.gameID]) { // Make sure game exists
      const game = allGames[socket.gameID]; // eslint-disable-line 
      console.log(socket.id, 'has left game', game.gameID);
      delete allPlayers[socket.id];
      if (game.state === 'awaiting players' ||
        game.players.length - 1 >= game.playerMinLimit) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (let j = 0; j < game.players.length; j++) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        delete allGames[socket.gameID];
      }
    }
    socket.leave(socket.gameID);
  };

  io.sockets.on('connection', function (socket) { // eslint-disable-line 
    console.log(socket.id +  ' Connected'); // eslint-disable-line 
    socket.emit('id', { id: socket.id });

    socket.on('pickCards', function(data) { // eslint-disable-line 
      console.log(socket.id, 'picked', data);
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards, socket.id);
      } else {
        console.log('Received pickCard from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('pickWinning', function(data) { // eslint-disable-line 
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card, socket.id);
      } else {
        console.log('Received pickWinning from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('joinGame', function(data) { // eslint-disable-line 
      if (!allPlayers[socket.id]) {
        joinGame(socket, data);
      }
    });

    socket.on('joinNewGame', function(data) { // eslint-disable-line 
      exitGame(socket);
      joinGame(socket, data);
    });

    socket.on('startGame', function() { // eslint-disable-line 
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        console.log('comparing', thisGame.players[0].socket.id, 'with', socket.id);
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach(function(game,index) { // eslint-disable-line
            if (game.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('leaveGame', function() { // eslint-disable-line
      exitGame(socket);
    });

    socket.on('disconnect', function(){ // eslint-disable-line
      console.log('Rooms on Disconnect ', io.sockets.manager.rooms);
      exitGame(socket);
    });
  });
};
