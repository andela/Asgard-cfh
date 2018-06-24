angular.module('mean.directives', []) //eslint-disable-line
  .directive('player', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link(scope, elem, attr) { //eslint-disable-line
        scope.colors = ['#7CE4E8', '#FFFFa5', '#FC575E', '#F2ADFF', '#398EC4', '#8CFF95'];
      }
    };
  }).directive('answers', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link(scope, elem, attr) { //eslint-disable-line

        scope.$watch('game.state', function () { //eslint-disable-line
          if (scope.game.state === 'winner has been chosen') {
            var curQ = scope.game.curQuestion; //eslint-disable-line
            var curQuestionArr = curQ.text.split('_'); //eslint-disable-line
            var startStyle = "<span style='color: "+scope.colors[scope.game.players[scope.game.winningCardPlayer].color]+"'>"; //eslint-disable-line
            var endStyle = '</span>'; //eslint-disable-line
            var shouldRemoveQuestionPunctuation = false; //eslint-disable-line
            var removePunctuation = function (cardIndex) { //eslint-disable-line
              var cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text; //eslint-disable-line
              if (cardText.indexOf('.', cardText.length - 2) === cardText.length - 1) {
                cardText = cardText.slice(0, cardText.length - 1);
              } else if ((cardText.indexOf('!', cardText.length - 2) === cardText.length - 1 ||
                cardText.indexOf('?', cardText.length - 2) === cardText.length - 1) &&
                cardIndex === curQ.numAnswers - 1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              var cardText = removePunctuation(0); //eslint-disable-line
              curQuestionArr.splice(1, 0, startStyle + cardText + endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3, 0, startStyle + cardText + endStyle);
              }
              curQ.text = curQuestionArr.join('');
              // Clean up the last punctuation mark in the question
              // if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.', curQ.text.length - 2) === curQ.text.length - 1) {
                  curQ.text = curQ.text.slice(0, curQ.text.length - 2);
                }
              }
            } else {
              curQ.text += ' '+startStyle+scope.game.table[scope.game.winningCard].card[0].text+endStyle; //eslint-disable-line
            }
          }
        });
      }
    };
  }).directive('question', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link(scope, elem, attr) {} //eslint-disable-line
    };
  })
  .directive('timer', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      templateUrl: '/views/timer.html',
      link(scope, elem, attr){}//eslint-disable-line
    };
  })
  .directive('landing', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      link(scope, elem, attr) { //eslint-disable-line
        scope.showOptions = true;
        if (window.localStorage.token) { //eslint-disable-line
          scope.showOptions = false;
        } else {
          scope.showOptions = true;
        }
      }
    };
  })
  .directive('chatpanel', function () { //eslint-disable-line
    return {
      restrict: 'EA',
      templateUrl: '/views/chat-panel.html',
      link(scope, elem, attr) { //eslint-disable-line
        $('#chat-container').css({ //eslint-disable-line
          bottom: -($('#msg-container').height() + $('#input-container').height()) //eslint-disable-line
        });
        $('#chat-submit-btn').css({ //eslint-disable-line
          height: `${32}px`
        });
        $(function() { //eslint-disable-line
          $("#chat-input").emojioneArea({ //eslint-disable-line
            pickerPosition: 'top',
            filtersPosition: 'bottom',
            tones: false,
            autocomplete: false,
            inline: true,
            hidePickerOnBlur: false,
            events: {
              keydown(editor, event) {
                // catches nothing but enter
                if (event.which === 13) {
                  scope.message = $('#chat-input').emojioneArea().data('emojioneArea').getText(); //eslint-disable-line
                  scope.sendMessage(scope.message);
                }
              }
            }
          });
        });
      }
    };
  });
