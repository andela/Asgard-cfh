angular.module('mean.system') //eslint-disable-line
  .factory('game', ['socket', '$timeout', function (socket, $timeout) { //eslint-disable-line
    var game = { //eslint-disable-line
      id: null, // This player's socket ID, so we know who this player is
      gameID: null,
      players: [],
      playerIndex: 0,
      winningCard: -1,
      winningCardPlayer: -1,
      gameWinner: -1,
      table: [],
      czar: null,
      playerMinLimit: 3,
      playerMaxLimit: 6,
      pointLimit: null,
      state: null,
      round: 0,
      time: 0,
      curQuestion: null,
      notification: null,
      timeLimits: {},
      joinOverride: false
    };

    var notificationQueue = []; //eslint-disable-line
    var timeout = false; //eslint-disable-line
    var self = this; //eslint-disable-line
    var joinOverrideTimeout = 0; //eslint-disable-line

    var setNotification = function() { //eslint-disable-line
      if (notificationQueue.length === 0) { // If notificationQueue is empty, stop
        clearInterval(timeout);
        timeout = false;
        game.notification = '';
      } else {
        // Show a notification and check again in a bit
        game.notification = notificationQueue.shift();
        timeout = $timeout(setNotification, 1300);
      }
    };

    var addToNotificationQueue = function(msg) { //eslint-disable-line
      notificationQueue.push(msg);
      if (!timeout) { // Start a cycle if there isn't one
        setNotification();
      }
    };

    var timeSetViaUpdate = false; //eslint-disable-line
    var decrementTime = function() { //eslint-disable-line
      if (game.time > 0 && !timeSetViaUpdate) {
        game.time--;
      } else {
        timeSetViaUpdate = false;
      }
      $timeout(decrementTime, 950);
    };

    socket.on('id', function(data) { //eslint-disable-line
      game.id = data.id;
    });

    socket.on('prepareGame', function(data) { //eslint-disable-line
      game.playerMinLimit = data.playerMinLimit;
      game.playerMaxLimit = data.playerMaxLimit;
      game.pointLimit = data.pointLimit;
      game.timeLimits = data.timeLimits;
    });

  socket.on('gameUpdate', function(data) { //eslint-disable-line
    // Update gameID field only if it changed.
    // That way, we don't trigger the $scope.$watch too often
      if (game.gameID !== data.gameID) {
        game.gameID = data.gameID;
      }
      game.joinOverride = false;
      clearTimeout(game.joinOverrideTimeout);

      var i; //eslint-disable-line
      // Cache the index of the player in the players array
      for (i = 0; i < data.players.length; i++) {
        if (game.id === data.players[i].socketID) {
          game.playerIndex = i;
        }
      }
      var newState = (data.state !== game.state); //eslint-disable-line

      // Handle updating game.time
      if (data.round !== game.round && data.state !== 'awaiting players' &&
        data.state !== 'game ended' && data.state !== 'game dissolved') {
        game.time = game.timeLimits.stateChoosing - 1;
        timeSetViaUpdate = true;
      } else if (newState && data.state === 'waiting for czar to decide') {
        game.time = game.timeLimits.stateJudging - 1;
        timeSetViaUpdate = true;
      } else if (newState && data.state === 'winner has been chosen') {
        game.time = game.timeLimits.stateResults - 1;
        timeSetViaUpdate = true;
      }

      // Set these properties on each update
      game.round = data.round;
      game.winningCard = data.winningCard;
      game.winningCardPlayer = data.winningCardPlayer;
      game.winnerAutopicked = data.winnerAutopicked;
      game.gameWinner = data.gameWinner;
      game.pointLimit = data.pointLimit;

      // Handle updating game.table
      if (data.table.length === 0) {
        game.table = [];
      } else {
        var added = _.difference(_.pluck(data.table,'player'), _.pluck(game.table,'player')); //eslint-disable-line
        var removed = _.difference(_.pluck(game.table,'player'), _.pluck(data.table,'player')); //eslint-disable-line
        for (i = 0; i < added.length; i++) {
          for (var j = 0; j < data.table.length; j++) { //eslint-disable-line
            if (added[i] === data.table[j].player) {
              game.table.push(data.table[j], 1);
            }
          }
        }
        for (i = 0; i < removed.length; i++) {
          for (var k = 0; k < game.table.length; k++) { //eslint-disable-line
            if (removed[i] === game.table[k].player) {
              game.table.splice(k, 1);
            }
          }
        }
      }

      if (game.state !== 'waiting for players to pick' || game.players.length !== data.players.length) {
        game.players = data.players;
      }
      if (newState || game.curQuestion !== data.curQuestion) {
        game.state = data.state;
      }
      if (data.state === 'czar pick black card') {
        game.czar = data.czar;
        if (game.czar === game.playerIndex) {
          addToNotificationQueue(`You are now a Czar, 
          select black to show new question`);
        } else {
          addToNotificationQueue('Waiting for Czar to pick card');
        }
      }

      if (data.state === 'waiting for players to pick') {
        game.czar = data.czar;
        game.curQuestion = data.curQuestion;
        // Extending the underscore within the question
        game.curQuestion.text = data.curQuestion.text.replace(/_/g, '<u></u>');

        // Set notifications only when entering state
        if (newState) {
          if (game.czar === game.playerIndex) {
            addToNotificationQueue('You\'re the Card Czar! Please wait!');
          } else if (game.curQuestion.numAnswers === 1) {
            addToNotificationQueue('Select an answer!');
          } else {
            addToNotificationQueue('Select TWO answers!');
          }
        }
      } else if (data.state === 'waiting for czar to decide') {
        if (game.czar === game.playerIndex) {
          addToNotificationQueue("Everyone's done. Choose the winner!");
        } else {
          addToNotificationQueue('The czar is contemplating...');
        }
      } else if (data.state === 'winner has been chosen' &&
                game.curQuestion.text.indexOf('<u></u>') > -1) {
        game.curQuestion = data.curQuestion;
      } else if (data.state === 'awaiting players') {
        joinOverrideTimeout = $timeout(function() { //eslint-disable-line
          game.joinOverride = true;
        }, 15000);
      } else if (data.state === 'game dissolved' || data.state === 'game ended') {
        game.players[game.playerIndex].hand = [];
        game.time = 0;
      }
    });

    socket.on('notification', function(data) { //eslint-disable-line
      addToNotificationQueue(data.notification);
    });

    game.joinGame = function(mode,room,createPrivate) { //eslint-disable-line
      mode = mode || 'joinGame';
      room = room || '';
      createPrivate = createPrivate || false;
      var userID = !!window.user ? user._id : 'unauthenticated'; //eslint-disable-line
      socket.emit(mode, { userID, room, createPrivate });
    };

    game.startGame = function() { //eslint-disable-line
      socket.emit('startGame');
    };

    game.leaveGame = function() { //eslint-disable-line
      game.players = [];
      game.time = 0;
      socket.emit('leaveGame');
    };

    game.pickCards = function(cards) { //eslint-disable-line
      socket.emit('pickCards', { cards });
    };

    game.beginGame = function() { //eslint-disable-line
      socket.emit('czarPickCard');
    };

    game.pickWinning = function(card) { //eslint-disable-line
      socket.emit('pickWinning', { card: card.id });
    };

    decrementTime();

    return game;
  }]);

