'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>',

    link: function($scope){
      $scope.$emit('tabadd', $scope);
    }
  });
};