'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    defaults: {
      name: ''
    },

    link: function($scope){
      $scope.$shadow.items.push($scope);
    }
  });
};