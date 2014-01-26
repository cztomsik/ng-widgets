'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ngWidgets', [])
;

module.exports = ngWidgets;

angular.element.prototype.find = require('./src/qsa.js');

ngWidgets
  .value('ngWidget', require('./src/ngWidget.js'))

  .directive('content', require('./src/content'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwField', require('./src/nw-field'))
  .directive('nwRow', require('./src/nw-row'))
  .directive('nwPanel', require('./src/nw-panel'))
  .directive('nwModal', require('./src/nw-modal'))

  .directive('nwLipsum', require('./src/nw-lipsum'))

  .directive('nwGrid', require('./src/nw-grid'))
  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
  .directive('nwTab', require('./src/nw-tab'))
;