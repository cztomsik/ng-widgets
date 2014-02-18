'use strict';

var
  angular = require('angular'),
  $injector = require('./injector'),
  $rootScope = $injector.get('$rootScope'),
  $compile = $injector.get('$compile')
;

module.exports = function(html, scope){
  var
    $element = angular.element(html),
    $scope = $rootScope.$new(true)
  ;

  $scope.$apply(function(){
    $element.data('$injector', $injector);
    $compile($element)(angular.extend($scope, scope));
  });

  return $element;
};