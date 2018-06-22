
angular.module('mean.system') // eslint-disable-line
.controller('GameController', ['$scope', 'game', '$http', '$timeout', '$location', 'MakeAWishFactsService', '$dialog', function ($scope, game, $http, $timeout, $location, MakeAWishFactsService, $dialog) { // eslint-disable-line
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    $scope.makeAWishFact = makeAWishFacts.pop();

    $scope.pickCard = function(card) { // eslint-disable-line
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };
    $scope.pointerCursorStyle = function() { // eslint-disable-line
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };
    $scope.sendPickedCards = function() { // eslint-disable-line
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function(card) { // eslint-disable-line
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = function(card) { // eslint-disable-line
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = function($index) { // eslint-disable-line
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = function($index) { // eslint-disable-line
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = function(card) { // eslint-disable-line
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function(card) { // eslint-disable-line
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function() { // eslint-disable-line
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function($index) { // eslint-disable-line
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function() { // eslint-disable-line
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function($index) { // eslint-disable-line
      return game.players[$index].premium;
    };

    $scope.currentCzar = function($index) { // eslint-disable-line
      return $index === game.czar;
    };

    $scope.winningColor = function($index) { // eslint-disable-line
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = function(winningSet) { // eslint-disable-line
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function() { // eslint-disable-line
      return game.winningCard !== -1;
    };

    $scope.startGame = function() { // eslint-disable-line
      $http.post(`/api/games/${$scope.game.gameID}/start`)
        .then(() => game.startGame());
    };
    $scope.abandonGame = function() { // eslint-disable-line
      game.leaveGame();
      $location.path('/');
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function() { // eslint-disable-line
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function() { // eslint-disable-line
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
      const gamePlayers = [];
      $scope.game.players.forEach((player) => {
        gamePlayers.push(player.username);
      });
      if (game.state === 'game ended') {
        const saveGame = {
          gameId: $scope.game.gameID,
          gameWinner: $scope.game.players[$scope.game.gameWinner].username,
          players: gamePlayers
        };
        $http.post('/api/game/save', saveGame)
          .then(res => console.log(res));
      }
    });

    $scope.$watch('game.gameID', function() { // eslint-disable-line
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout( function() { // eslint-disable-line
              var link = document.URL; // eslint-disable-line
              var txt = 'Give the following link to your friends so they can join your game: '; // eslint-disable-line
              $('#lobby-how-to-play').text(txt); // eslint-disable-line
              $('#oh-el').css({'text-align': 'center', 'font-size':'22px', 'background': 'white', 'color': 'black'}).text(link); // eslint-disable-line
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }]);
