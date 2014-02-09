'use strict';

var
  angular = require('angular'),
  ngWidgets = require('../..')
;

module.exports = function(html, config){
  var
    $injector = angular.bootstrap(html, [ngWidgets.name].concat(config || [])),
    $element = $injector.get('$rootElement')
  ;

  return $element;
};