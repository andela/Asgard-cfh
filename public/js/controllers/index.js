angular.module('mean.system').controller('IndexController', [ //eslint-disable-line
  '$scope',
  'Global',
  '$http',
  '$window',
  '$location',
  '$q',
  'socket',
  'game',
  'AvatarService',
  function ($scope, Global, $http, $window, $location, $q, socket, game, AvatarService) { //eslint-disable-line
    $scope.global = Global;

    $scope.playAsGuest = function () { //eslint-disable-line
      game.joinGame();
      $location.path('/app');
    };

    $scope.showLoginError = false;
    $scope.hasSignupError = false;
    $scope.SignupError = null;
    $scope.loginError = null;
    $scope.dontShow = false;
    $scope.avatars = [];
    let userId = null;
    if (window.user) {
      userId = window.user._id;
    }
    $scope.user = {};

    AvatarService.getAvatars()
      .then(function (data) { //eslint-disable-line
        $scope.avatars = data;
      });

    $scope.image = '';
    $scope.image_preview = '';
    $scope.readImage = () => { //eslint-disable-line
      const file = event.target.files[0]; //eslint-disable-line
      if (file) {
        const fileReader = new FileReader(); //eslint-disable-line
        fileReader.readAsDataURL(file);
        fileReader.onload = function (event) { //eslint-disable-line
          $scope.image_preview = event.target.result;
          $scope.image = file;
        };
      }
    };

    $scope.signUp = function () { //eslint-disable-line
      if ($scope.image) {
        var imageData = new FormData(); //eslint-disable-line
        imageData.append('file', $scope.image);
        imageData.append('upload_preset', 'zyu1ajoa');
        imageData.append('api_key', '126852175969548');
        $.ajax({ //eslint-disable-line
          url: 'https://api.cloudinary.com/v1_1/clintfidel/image/upload',
          data: imageData,
          method: 'POST',
          contentType: false,
          processData: false,
          success(res) {
            $scope.user.profileImage = res.secure_url;
            $http.post('/api/auth/signup', $scope.user)
              .then(() => {
                $('#signUpModal').modal('show'); //eslint-disable-line
              }, (error) => {
                if (error.data.errors) {
                  $scope.hasSignupError = true;
                  $scope.signupError = error.data.errors[0].msg || error.data.msg;
                }
              });
          }
        });
      } else {
        $http.post('/api/auth/signup', $scope.user)
          .then(
            () => {
              $('#signUpModal').modal('show'); //eslint-disable-line
            },
            (error) => {
              if (error.data.errors) {
                $scope.hasSignupError = true;
                $scope.signupError = error.data.errors[0].msg || error.data.message;
              }
              if (error.data.message) {
                $scope.hasSignupError = true;
                $scope.signupError = error.data.message;
              }
            }
          );
      }
    };

    $scope.login = function () { //eslint-disable-line
      $http.post('/api/auth/login', $scope.user)
        .then((response) => {
          localStorage.setItem('token', response.data.token); //eslint-disable-line
          $http.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
          $location.path('/');
        }, (error) => {
          $scope.showLoginError = true;
          $scope.loginError = error.data.message;
        });
    };

    $scope.logout = function () { //eslint-disable-line
      $http.get('/signout')
        .then(() => {
          localStorage.removeItem('token'); //eslint-disable-line
          $location.path('/#!');
        });
    };
    $scope.openDropdown = () => {
      $('.dropdown-toggle').dropdown();
    };
  }]);
