angular.module('userServices', []) //eslint-disable-line
.factory('User', function($http) { //eslint-disable-line
    var userFactory = {}; //eslint-disable-line
    // User.activeAccount(token);
    userFactory.activeAccount = function (token) { //eslint-disable-line
      return $http.put('/api/' + token); //eslint-disable-line
    };
    return userFactory;
  });

