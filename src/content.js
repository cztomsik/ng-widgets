'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    link: function($scope, $element){
      $element.prop('$shadow', $scope);
      $element.append($scope.$host.contents());
    }
  };
};