'use strict';

var
  angular = require('angular'),
  ngWidgets = require('../..')
;

module.exports = function(html){
  var
    $injector = angular.bootstrap(html, [ngWidgets.name]),
    $element = $injector.get('$rootElement')
  ;

  return $element;
};