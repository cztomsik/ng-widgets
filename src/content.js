'use strict';

module.exports = {
  restrict: 'E',
  controller: function($scope, $element, $transclude){
    $transclude($scope.$parent, $element.append.bind($element));
  }
};