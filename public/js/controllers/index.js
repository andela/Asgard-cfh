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

    /**self add */
    $scope.myInterval = 5000;
    // $scope.noWrapSlides = false;
    // $scope.active = 0;
    // const slides = $scope.slides = [];
    // let currIndex = 0;

    // $scope.addSlide = function() {
    //   var newWidth = 600 + slides.length + 1;
    //   slides.push({
    //     image: '//unsplash.it/' + newWidth + '/300',
    //     text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
    //     id: currIndex++
    //   });
    // };
  
    // $scope.randomize = function() {
    //   var indexes = generateIndexesArray();
    //   assignNewIndexesToSlides(indexes);
    // };
  
    // for (var i = 0; i < 4; i++) {
    //   $scope.addSlide();
    // }
  
    // // Randomize logic below
  
    // function assignNewIndexesToSlides(indexes) {
    //   for (var i = 0, l = slides.length; i < l; i++) {
    //     slides[i].id = indexes.pop();
    //   }
    // }
  
    // function generateIndexesArray() {
    //   var indexes = [];
    //   for (var i = 0; i < currIndex; ++i) {
    //     indexes[i] = i;
    //   }
    //   return shuffle(indexes);
    // }
  
    // // http://stackoverflow.com/questions/962802#962890
    // function shuffle(array) {
    //   var tmp, current, top = array.length;
  
    //   if (top) {
    //     while (--top) {
    //       current = Math.floor(Math.random() * (top + 1));
    //       tmp = array[current];
    //       array[current] = array[top];
    //       array[top] = tmp;
    //     }
    //   }
  
    //   return array;
    // }

    /**self add end */

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

     $scope.signUp = () => {
       if ($scope.image) {
        const imageData = new FormData();
        imageData.append('file', $scope.image);
        imageData.append('upload_preset', 'zyu1ajoa');
        imageData.append('api_key', '126852175969548')
        $.ajax({
          url: "https://api.cloudinary.com/v1_1/clintfidel/image/upload",
          data: imageData,
          method: 'POST',
          contentType: false,
          processData: false,
          success(res){
            $scope.user.profileImage = res.secure_url;
            $http.post('/api/auth/signup', $scope.user)
            .then((response) => {
            localStorage.setItem('token', response.data.token);
         //  $http.default.headers.common['x-access-token'] = response.data.token;
          $location.path('/');
        })
          },
        })
       } else {
        $http.post('/api/auth/signup', $scope.user)
        .then((response) => {
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
        $location.path('/');
      }, (error) => {
        $scope.showError = true;
      });
      
    }

    $scope.logout =() => {
        localStorage.removeItem('token');
        $location.path('/#!');
    }
}]);