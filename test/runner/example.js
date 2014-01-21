'use strict';

var
  angular = require('angular'),
  ngWidgets = require('../..'),

  $injector = angular.injector(['ng', 'ngWidgets']),
  $compile = $injector.get('$compile'),
  $rootScope = $injector.get('$rootScope')
;

module.exports = function(html){
  var
    element = angular.element(html),
    scope = $rootScope.$new(true)
  ;

  return $compile(element)(scope) && element;
};