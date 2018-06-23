angular.module('mean.system') //eslint-disable-line
  .controller('GameController', [
    '$scope', 'game', '$http', '$timeout', '$location',
    'MakeAWishFactsService', '$dialog', '$firebaseArray', '$window', '$document',
    function ( //eslint-disable-line
      $scope, game, $http, $timeout, $location,
      MakeAWishFactsService, $dialog, $firebaseArray, $window, $document) { //eslint-disable-line
      let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      $scope.hasPickedCards = false;
      $scope.winningCardPicked = false;
      $scope.showTable = false;
      $scope.modalShown = false;
      $scope.game = game;
      $scope.pickedCards = [];
      $scope.makeAWishFact = makeAWishFacts.pop();
      $scope.newMessages = 0;
      $scope.chatIsClosed = true;
      $scope.info = null;

      // chat implementation
      const initChatService = (gameID) => {
        const firebaseRef = firebase.database().ref().child('entries') //eslint-disable-line
          .child(`${gameID}`);
        firebaseRef.remove();
        $scope.chats = $firebaseArray(firebaseRef);
        // At here we check for new unread messages...
        $scope.chats.$watch((e) => {
          if (e.event === 'child_added' && $scope.chatIsClosed) {
            $scope.newMessages += 1;
            $scope.info = 'new !';
          }
        });
      };
      $scope.clearChatInput = () => {
        $scope.message = '';
      };
      $scope.resetForm = () => {
        $('#chat-input').emojioneArea().data('emojioneArea').setText(''); //eslint-disable-line
      };
      $scope.togglePanel = () => {
        $('#chat-container').toggleClass('chat-panel-slide-up'); //eslint-disable-line
        $('#chat-container').toggleClass('chat-panel-slide-down'); //eslint-disable-line
        if ($('#chat-container').hasClass('chat-panel-slide-up')) { //eslint-disable-line
          $('#chat-container').animate({ //eslint-disable-line
            bottom: 0
          });
          $scope.chatIsClosed = false;
          $scope.newMessages = 0;
          $scope.info = null;
          if ($('#up-down-icon').hasClass('fa-rotate-0')) { //eslint-disable-line
            $('#up-down-icon').removeClass('fa-rotate-0'); //eslint-disable-line
          }
          $('#up-down-icon').addClass('fa-rotate-180'); //eslint-disable-line
          return;
        }
        if ($('#chat-container').hasClass('chat-panel-slide-down')) { //eslint-disable-line
          $('#chat-container').animate({ //eslint-disable-line
            bottom: -($('#msg-container').height() + $('#input-container').height()) //eslint-disable-line
          });
          $scope.chatIsClosed = true;
          if ($('#up-down-icon').hasClass('fa-rotate-180')) { //eslint-disable-line
            $('#up-down-icon').removeClass('fa-rotate-180'); //eslint-disable-line
          }
          $('#up-down-icon').toggleClass('.fa-rotate-0'); //eslint-disable-line
        }
      };

      // This method controls chat slider to scroll down to the latest messages
      $scope.downScrollPane = () => {
        $('#msg-container').stop().animate({ //eslint-disable-line
          scrollTop: $('#msg-container')[0].scrollHeight //eslint-disable-line
        }, 1000);
      };

      $scope.sendMessage = (message) => {
        if (message) {
          $scope.chats.$add({
            avatar: game.players[game.playerIndex].profileImage || game.players[game.playerIndex].avatar, //eslint-disable-line
            message: $scope.message,
            date: Date.now(),
            userName: game.players[game.playerIndex].username
          });
          $scope.clearChatInput();
          $scope.resetForm();
          $scope.downScrollPane();
        }
      };

      $scope.pickCard = function (card) { //eslint-disable-line
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
      $scope.pointerCursorStyle = function () { //eslint-disable-line
        if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
          return { cursor: 'pointer' };
        }
        return {};
      };
    $scope.sendPickedCards = function() { //eslint-disable-line
        game.pickCards($scope.pickedCards);
        $scope.showTable = true;
      };
      $window.onload = $('#gameModal').modal('show'); //eslint-disable-line
      $scope.cardIsFirstSelected = function(card) { //eslint-disable-line
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[0];
        }
        return false;
      };
      $scope.closeModal = () => {
        $('#gameModal').remove(); //eslint-disable-line
        $('.modal-backdrop').hide(); //eslint-disable-line
      };
      $scope.cardIsSecondSelected = function(card) { //eslint-disable-line
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[1];
        }
        return false;
      };
      $scope.firstAnswer = function ($index) { //eslint-disable-line
        if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };

      $scope.secondAnswer = function ($index) { //eslint-disable-line
        if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };

      $scope.showFirst = function (card) { //eslint-disable-line
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
      };

      $scope.showSecond = function (card) { //eslint-disable-line
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
      };

      $scope.isCzar = function () { //eslint-disable-line
        return game.czar === game.playerIndex;
      };

      $scope.isPlayer = function ($index) { //eslint-disable-line
        return $index === game.playerIndex;
      };

      $scope.isCustomGame = function () { //eslint-disable-line
        return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
      };

      $scope.isPremium = function ($index) { //eslint-disable-line
        return game.players[$index].premium;
      };

      $scope.currentCzar = function ($index) { //eslint-disable-line
        return $index === game.czar;
      };

      $scope.winningColor = function ($index) { //eslint-disable-line
        if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
          return $scope.colors[game.players[game.winningCardPlayer].color];
        }
        return '#f9f9f9';
      };

      $scope.pickWinning = function (winningSet) { //eslint-disable-line
        if ($scope.isCzar()) {
          game.pickWinning(winningSet.card[0]);
          $scope.winningCardPicked = true;
        }
      };

      $scope.winnerPicked = function () { //eslint-disable-line
        return game.winningCard !== -1;
      };

      $scope.startGame = function () { //eslint-disable-line
        if ($scope.isCustomGame()) {
          $http.post(`/api/games/${$scope.game.gameID}/start`)
            .then(() => {
              $scope.showTour = false;
              return game.startGame();
            });
        } else {
          $scope.showTour = false;
          game.startGame();
        }
      };
    $scope.abandonGame = function () { //eslint-disable-line
        game.leaveGame();
        $location.path('/');
      };

      // resume game after czar pick card
      $scope.resumeGame = () => {
        if ($scope.isCzar()) {
          game.beginGame();
        }
      };

      // czar shuffle cards and selct card
      $scope.czarSelectBlackCard = () => {
        if ($scope.isCzar() && game.state === 'czar pick black card') {
          document.getElementById('myCard').classList.toggle('flip-container'); //eslint-disable-line
          $timeout(() => {
            document.getElementById('myCard').classList.toggle('flip-container'); //eslint-disable-line
            $scope.resumeGame();
          }, 2000);
        }
      };
      // Catches changes to round to update when no players pick card
      // (because game.state remains the same)
      $scope.$watch('game.round', function () { //eslint-disable-line
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
      $scope.$watch('game.state', function () { //eslint-disable-line
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

      // $scope.$watch('game.state', () => {
      //   if(!$scope.isCzar() && game.state === 'czar pick black card') {
      //     $scope.waitingForCzar = 'wait, the czar is picking a card';
      //   }
      //   else {
      //     $scope.waitingForCzar = ''
      //   }
      // })

      $scope.$watch('game.gameID', function () { //eslint-disable-line
        if (game.gameID) {
          $('#chat-input').emojioneArea({ //eslint-disable-line
            events: {
              keydown: (editor, event) => {
                if (event.keyCode === 13) {
                  console.log('message');
                }
              }
            }
          });
          initChatService($scope.game.gameID);
        }
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
              setTimeout(function (){ //eslint-disable-line
                const link = document.URL; //eslint-disable-line
                const txt = 'Give the following link to your friends so they can join your game: ';
                $('#lobby-how-to-play').text(txt); //eslint-disable-line
                $('#oh-el').css({ //eslint-disable-line
                  'text-align': 'center',
                  'font-size': '22px',
                  background: 'white',
                  color: 'black'
                }).text(link);
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
      // };
    }]);
