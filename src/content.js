'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    link: function($scope, $element){
      $element.append($scope.$host.contents());
    }
  };
};