angular.module('mean.system') //eslint-disable-line
  .factory('socket', ['$rootScope', function ($rootScope) { //eslint-disable-line
    var socket = io.connect(); //eslint-disable-line
    return {
      on(eventName, callback) {
      socket.on(eventName, function() { //eslint-disable-line
        var args = arguments; //eslint-disable-line
        $rootScope.safeApply(function() { //eslint-disable-line
            callback.apply(socket, args);
          });
        });
      },
      emit(eventName, data, callback) {
        socket.emit(eventName, data, function () { //eslint-disable-line
          var args = arguments; //eslint-disable-line
        });
        $rootScope.safeApply(function () { //eslint-disable-line
          if (callback) {
            callback.apply(socket, args); //eslint-disable-line
          }
        });
      },
      removeAllListeners(eventName, callback) {
        socket.removeAllListeners(eventName, function () { //eslint-disable-line
          const args = arguments; //eslint-disable-line
          $rootScope.safeApply(function () { //eslint-disable-line
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
