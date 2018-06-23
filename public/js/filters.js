angular.module('mean.system') //eslint-disable-line
  .filter('upperFirstLetter', function() { //eslint-disable-line
    return function(input) { //eslint-disable-line
      input = input || '';
      return input.charAt(0).toUpperCase() + input.slice(1);
    };
  });
