angular.module('userServices', [])
.factory('User', function($http) {
    var userFactory = {};
    // User.activeAccount(token);
    userFactory.activeAccount = function (token) {
      return $http.put('/api/' + token);
    };
    return userFactory;
  });

