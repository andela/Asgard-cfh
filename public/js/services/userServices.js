angular.module('userServices', []) // eslint-disable-line
.factory('User', function($http) { // eslint-disable-line
    const userFactory = {};
    // User.activeAccount(token);
    userFactory.activeAccount = function(token) { // eslint-disable-line
      return $http.put(`/api/${token}`);
    };
    return userFactory;
  });

