angular.module('mean.system')
.controller('IndexController', ['$scope', '$http', 'Global', '$location', 'socket', 'game', 'AvatarService', function ($scope, $http, Global, $location, socket, game, AvatarService) {
    $scope.global = Global;

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = false;

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });
      
     $scope.signUp = function() {
       $http.post('/api/auth/signup', $scope.user)
       .then((response) => {
         localStorage.setItem('token', response.data.token);
        //  $http.default.headers.common['x-access-token'] = response.data.token;
         $location.path('/');
       })
     }

     $scope.login = function() {
      $http.post('/api/auth/login', $scope.user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
       //  $http.default.headers.common['x-access-token'] = response.data.token;
        $location.path('/');
      }, (error) => {
        // console.log(error.data, '=====>');
        $scope.showError = true;
      });
      
    }

    $scope.logout = function() {
        localStorage.removeItem('token');
        $location.path('/#!');
    }
}]);