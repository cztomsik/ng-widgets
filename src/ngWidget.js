'use strict';

var
  angular = require('angular')
;

module.exports = function(widgetDef){
  return angular.extend({}, {
    restrict: 'E',
    template: '',
    transclude: true,
    scope: {}
  }, widgetDef);
};