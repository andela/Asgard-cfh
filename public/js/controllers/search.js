/* eslint-disable */
var app = angular.module('myApp', []);

app.filter('highlight', ['$sce', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')

        return $sce.trustAsHtml(text)
    }
}]);

app.controller('SearchController', function($scope) {

    $scope.foundUser = [
        'olatunji',
        'tunji',
        'douglas',
        'douglazz',
        'rotimi',
        'clinton',
        'daramola',
        'henry',
        'saheed',
        'clintzbaba',
        'fortune'
      ];

      $scope.invite = {};
$scope.invite.link = window.location.href;


$scope.inviteFriend = () => {
// $http.post('/api/game/invitation', $scope.invite)
// .then((response) => {
// alert('request sent!')
// }, (error) => {
// alert('request not sent!')
// });
alert(`invitation ${$scope.invite.link} sent to ${$scope.invite.email}`)
}
  
});