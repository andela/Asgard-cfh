angular.module('mean.system')
  .controller('GameController', [
    '$scope', '$sce', 'game', '$http', '$timeout', '$location',
    'MakeAWishFactsService', '$dialog', '$firebaseArray', '$window', '$document',
    function (
      $scope, $sce, game, $http, $timeout, $location,
      MakeAWishFactsService, $dialog, $firebaseArray, $window, $document) {
      $scope.hasPickedCards = false;
      $scope.winningCardPicked = false;
      $scope.showTable = false;
      $scope.modalShown = false;
      $scope.game = game;
      $scope.regionId = ($scope.selectedRegion === "Africa") ? "1" : "2";
      $scope.selectedRegion = "Africa"
      $scope.regions = [ "Africa", "Europe", "Asia", "Americas", "others" ];
      $scope.pickedCards = [];
      var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      $scope.makeAWishFact = makeAWishFacts.pop();
      $scope.showTour = true;
      $scope.gameModal = true;
      $scope.newMessages = 0;
      $scope.chatIsClosed = true;
      $scope.info = null;

      $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
      };
      // chat implementation
      var initChatService = function (gameID) {
        var firebaseRef = firebase.database().ref().child('entries')
          .child(`${gameID}`);
        // firebaseRef.remove();
        $scope.chats = $firebaseArray(firebaseRef);
        // Here we check for new unread messages...
        $scope.chats.$watch(function (e) {
          if (e.event === 'child_added' && $scope.chatIsClosed) {
            $scope.newMessages += 1;
            $scope.info = 'new !';
          }
        });
      };
      $scope.snapChatPanelToBottom = function () {
        $('#chat-container').css({
          bottom: -($('#msg-container').height() + $('#input-container').height())
        });
      };
      $(window).resize(() => {
        $scope.snapChatPanelToBottom();
      });
      $scope.clearChatInput = function () {
        $scope.message = '';
      };
      $scope.resetForm = function () {
        $('#chat-input').emojioneArea().data('emojioneArea').setText('');
      };
      $scope.togglePanel = function () {
        $('#chat-container').toggleClass('chat-panel-slide-up');
        $('#chat-container').toggleClass('chat-panel-slide-down');
        if ($('#chat-container').hasClass('chat-panel-slide-up')) {
          $('#chat-container').animate({
            bottom: 0
          });
          $scope.chatIsClosed = false;
          $scope.newMessages = 0;
          $scope.info = null;
          if ($('#up-down-icon').hasClass('fa-rotate-0')) {
            $('#up-down-icon').removeClass('fa-rotate-0');
          }
          $('#up-down-icon').addClass('fa-rotate-180');
          return;
        }
        if ($('#chat-container').hasClass('chat-panel-slide-down')) {
          $('#chat-container').animate({
            bottom: -($('#msg-container').height() + $('#input-container').height())
          });
          $scope.chatIsClosed = true;
          if ($('#up-down-icon').hasClass('fa-rotate-180')) {
            $('#up-down-icon').removeClass('fa-rotate-180');
          }
          $('#up-down-icon').toggleClass('.fa-rotate-0');
        }
      };

      // This method controls chat slider to scroll down to the latest messages
      $scope.downScrollPane = function () {
        $('#msg-container').stop().animate({
          scrollTop: $('#msg-container')[0].scrollHeight
        }, 1000);
      };

      $scope.sendMessage = function (message) {
        if (message) {
          $scope.chats.$add({
            avatar: game.players[game.playerIndex].profileImage || game.players[game.playerIndex].avatar,
            message: $scope.message,
            date: Date.now(),
            userName: game.players[game.playerIndex].username
          });
          $scope.clearChatInput();
          $scope.resetForm();
          $scope.downScrollPane();
        }
      };

      $scope.pickCard = function (card) {
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
      $scope.pointerCursorStyle = function () {
        if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
          return { cursor: 'pointer' };
        }
        return {};
      };

      $scope.sendPickedCards = function() {
        game.pickCards($scope.pickedCards);
        $scope.showTable = true;
      };
      $window.onload = $('#gameModal').modal('show');
      $scope.cardIsFirstSelected = function(card) {
        if (game.curQuestion.numAnswers > 1) {
          return card === $scope.pickedCards[0];
        }
        return false;
      };

    $scope.closeModal = () => {
      $('#gameModal').remove();
      $('.modal-backdrop').hide();
    };

    $scope.closeRegionModal = () => {
      $('#regionModal').remove();
      $('.modal-backdrop').hide();
    };

    $scope.openRegionModal = () => {
      $('#regionModal').modal('show');
    };

    $scope.cardIsSecondSelected = function(card) { // eslint-disable-line
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      };
      $scope.firstAnswer = function ($index) {
        if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };
    }
      $scope.secondAnswer = function ($index) {
        if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
          return true;
        }
        return false;
      };

      $scope.showFirst = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
      };

      $scope.showSecond = function (card) {
        return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
      };

      $scope.isCzar = function () {
        return game.czar === game.playerIndex;
      };

      $scope.isPlayer = function ($index) {
        return $index === game.playerIndex;
      };

      $scope.isCustomGame = function () {
        return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
      };

    $scope.isPremium = function($index) {
      return $scope.premium = game.players[$index].premium;
    };

    $scope.addDonation = function() {
      //  return console.log(window.user);
             return $scope.premium = game.players[$index].premium;
    };

    $scope.currentCzar = function($index) { // eslint-disable-line
      return $index === game.czar;
    };

      $scope.winningColor = function ($index) {
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

    $scope.startGame = function() {
      if ($scope.isCustomGame()) {
        $http.post('/api/games/'+$scope.game.gameID+'/start')
          .then(() => {
            $scope.showTour = false;
            $scope.closeRegionModal();
            return game.startGame();
          });
      } else {
        $scope.showTour = false;
        $scope.closeRegionModal();
        game.startGame($scope.regionId);
      }
    };

      $scope.winnerPicked = function () {
        return game.winningCard !== -1;
      };

      $scope.abandonGame = function () {
          game.leaveGame();
          $location.path('/');
      };
      // resume game after czar pick card
      $scope.resumeGame = function () {
        if ($scope.isCzar()) {
          game.beginGame();
        }
      };

      // czar shuffle cards and selct card
      $scope.czarSelectBlackCard = function () {
        if ($scope.isCzar() && game.state === 'czar pick black card') {
          document.getElementById('myCard').classList.toggle('flip-container');
          $timeout(function () {
            document.getElementById('myCard').classList.toggle('flip-container');
            $scope.resumeGame();
          }, 2000);
        }
      };
      // Catches changes to round to update when no players pick card
      // (because game.state remains the same)
      $scope.$watch('game.round', function () {
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
      $scope.$watch('game.state', function () {
        if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
          $scope.showTable = true;
        }
        var gamePlayers = [];
        $scope.game.players.forEach( function (player) {
          gamePlayers.push({
            username: player.username,
            points: player.points
          });
        });
        if (game.state === 'game ended') {
          var saveGame = {
            gameId: $scope.game.gameID,
            gameWinner: $scope.game.players[$scope.game.gameWinner].username,
            players: gamePlayers
          };
          $http.post('/api/game/save', saveGame)
            .then(function (res) { console.log(res) });
        }
        if(!$scope.isCzar() && game.state === 'czar pick black card') {
          $scope.waitingForCzar = 'wait, the czar is picking a card';
        } else {
          $scope.waitingForCzar = ''
        }
      });

      $scope.$watch('game.gameID', function () {
        if (game.gameID) {
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
              setTimeout(function (){
                var link = document.URL;
                var txt = 'Give the following link to your friends so they can join your game: ';
                $('#lobby-how-to-play').css({'text-align': 'center', 'font-size':'22px', 'font-weight':'bold', 'background': 'white', 'color': 'black'}).text(txt); 
                $('#oh-el').css({'text-align': 'center', 'font-size': '22px', 'background': 'white', 'color': 'black'}).text(link);
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
