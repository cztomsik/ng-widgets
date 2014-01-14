'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    controller: function($scope, $element, $transclude){
      $transclude($scope.$parent, $element.append.bind($element));
    }
  };
};