'use strict';

/* global angular */
var
  module = angular.module('ngWidgets', []),

  elements = {
    'content': require('./src/content'),
    'nwList': require('./src/nw-list'),
    'nwField': require('./src/nw-field'),
    'nwPanel': require('./src/nw-panel'),
    'nwGrid': require('./src/nw-grid')
  }
;


for (var k in elements){
  module.directive(k, angular.identity.bind(null, elements[k]));
}