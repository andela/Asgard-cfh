angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.route', 'ngRoute', 'firebase', 'mean.system', 'mean.directives']) //eslint-disable-line
  .config(['$routeProvider',
      function($routeProvider) { //eslint-disable-line
      $routeProvider
        .when('/', {
          templateUrl: 'views/index.html',
        })
        .when('/confirmaccount', {
          templateUrl: '/views/activateEmail.html',
        })
        .when('/activationComplete', {
          templateUrl: '/views/activateComplete.html',
        })
        .when('/app', {
          templateUrl: '/views/app.html',
        })
        .when('/privacy', {
          templateUrl: '/views/privacy.html',
        })
        .when('/bottom', {
          templateUrl: '/views/bottom.html'
        })
        .when('/signin', {
          templateUrl: '/views/signin.html'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
        })
        .when('/choose-avatar', {
          templateUrl: '/views/choose-avatar.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]).config(['$locationProvider',
    function($locationProvider) { //eslint-disable-line
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function($rootScope) { //eslint-disable-line
    $rootScope.safeApply = function(fn) { //eslint-disable-line
      var phase = this.$root.$$phase; //eslint-disable-line
      if (phase == '$apply' || phase == '$digest') { //eslint-disable-line
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }])
  .run(['DonationService', function (DonationService) { //eslint-disable-line
    window.userDonationCb = function (donationObject) { //eslint-disable-line
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', []); //eslint-disable-line
angular.module('mean.directives', []); //eslint-disable-line
