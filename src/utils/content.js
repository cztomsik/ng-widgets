'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    controller: function($scope, $element, $transclude){
      $transclude($scope.$host, $element.append.bind($element));
    }
  };
};