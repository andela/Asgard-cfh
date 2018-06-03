// import dotenv from 'dotenv';
// dotenv.config();
/* eslint-disable */
angular.module('mean.system').controller('IndexController', [
  '$scope',
  'Global',
  '$http',
  '$window',
  '$location',
  '$q',
  'socket',
  'game',
  'AvatarService',
  ($scope, Global, $http, $window, $location, $q, socket, game, AvatarService) => {
    $scope.global = Global;

    

   $scope.playAsGuest = () => {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = false;

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

      $scope.image = '';
      $scope.image_preview = '';
      // $scope.user = { };
      $scope.readImage = () => {
        const file = event.target.files[0];
        if(file) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = event => {
            $scope.image_preview = event.target.result
            $scope.image = file
          };
        }
      }
      // const readImage = () => {
      //   const myFile = $('#profile-pic').prop('files')[0];
      //   const fReader = new FileReader();
      //   fReader.readAsDataURL(myFile);
      //   fReader.onload = e => {
      //     $('.profile-image').attr('src', e.target.result);
      //   };
      // };

     $scope.signUp = () => {
       if ($scope.image) {
        const imageData = new FormData();
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/json')
        imageData.append('file', $scope.image);
        imageData.append('upload_preset', 'zyu1ajoa');
        imageData.append('api_key', '126852175969548')
        $.ajax({
          url: "https://api.cloudinary.com/v1_1/clintfidel/image/upload",
          data: imageData,
          // headers: headers,
          method: 'POST',
          contentType: false,
          processData: false,
          success(res){
            $scope.user.profileImage = res.secure_url;
            $http.post('/users', $scope.user)
            .then((response) => {
            localStorage.setItem('token', response.data.token);
         //  $http.default.headers.common['x-access-token'] = response.data.token;
          $location.path('/');
        })
          },
        })
          //  $scope.user.image = res.secure_url;
          //  console.log($scope.user.image, 'i set the image here');
          //  // $scope.user = res.public_id
      
       } else {
        $http.post('/users', $scope.user)
        .then((response) => {
          console.log(response, 'i got here');
          localStorage.setItem('token', response.data.token);
         //  $http.default.headers.common['x-access-token'] = response.data.token;
          $location.path('/');
        })
      }
      }

     $scope.login = () => {
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

    $scope.logout =() => {
        localStorage.removeItem('token');
        $location.path('/#!');
    }
}]);