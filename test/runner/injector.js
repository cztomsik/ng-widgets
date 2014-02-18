'use strict';

var
  angular = require('angular'),
  ngWidgets = require('../..')
;

module.exports = angular.bootstrap('<div></div>', [ngWidgets.name, saveCompileProvider]);

//for the sake of testing, allow $compileProvider to be obtained using $injector.get()
function saveCompileProvider($provide, $compileProvider){
  $provide.constant('$compileProvider', $compileProvider);
}