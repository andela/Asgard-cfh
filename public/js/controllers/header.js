angular.module('mean.system') //eslint-disable-line
.controller('HeaderController', ['$scope', 'Global', function ($scope, Global) { //eslint-disable-line
    $scope.global = Global;
    $scope.menu = [{
      title: 'Articles',
      link: 'articles'
    }, {
      title: 'Create New Article',
      link: 'articles/create'
    }];
  }]);
