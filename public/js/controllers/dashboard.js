/* eslint-disable */
angular.module('mean.system')
  .controller('DashboardController', ['$scope', '$window', 'Global', '$http', '$q', function($scope, $window, Global, $http){
    $scope.global = Global;
    $scope.gameLog = [];
    $scope.gameLogError = null;
    $scope.leaderBoard = [];
    $scope.leaderBoardError = null;
    $scope.donations = [];
    $scope.donationsError = null;

    const token = localStorage.token;

    $scope.getGameLog = () => {
      $http({
        method: 'GET',
        url: '/api/games/history',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      }).then((res) => {
          $scope.gameLog = res.data;
      },
    (err) => {
        if (err.status === 404){
          $scope.gameLogError = "No Games Played";
        } else if (err.status === 401) {
          $scope.gameLogError = "You need to be logged in to view this page"
          $location.path('/')
        } else {
          return err;
        }
    });
    };

    $scope.openDropdown = () => {
      $('.dropdown-toggle').dropdown()
    }

    $scope.getLeaderBoard = () => {
      $http({
        method: 'GET',
        url: '/api/leaderboard',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      }).then((res) => {
        $scope.leaderBoard = res.data;
      },
    (err) => {
      if (err.status === 404) {
        $scope.donationsError = err.data.message
      }
    })
    }

    $scope.getDonations = () => {
      $http({
        method: 'GET',
        url: '/api/donations',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        }
      }).then((res) => {
        $scope.donations = res.data;
      },
      (err) => {
        if (err.status === 404) {
          $scope.donationsError = err.data.message
        } else if (err.status === 401) {
          $scope.donationsError = err.data.message;
        }
      })
    }

    $scope.populateDashboard = () => {
        $scope.getGameLog();
        $scope.getLeaderBoard();
        $scope.getDonations();
    };

    $window.onload = $scope.populateDashboard();
  }]);

