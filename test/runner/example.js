'use strict';

var
  angular = require('angular'),
  ngWidgets = require('../..')
;

module.exports = function(html){
  console.log('=========== example =====');

  var
    $injector = angular.bootstrap(html, ['ng', ngWidgets.name]),
    el = $injector.get('$rootElement')
  ;

  return el;
};