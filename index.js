'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ng-widgets', []),

  jQuery = global.jQuery
;

module.exports = ngWidgets;

//TODO: test
//quick and dirty
if ( ! jQuery){
  angular.element.prototype.find = require('./src/qsa.js');
}

ngWidgets
  .value('ngWidget', require('./src/ng-widget.js'))

  .filter('markdown', require('./src/markdown.js'))

  .directive('content', require('./src/content'))

  .directive('nwBtn', require('./src/nw-btn'))
  .directive('nwSaveBtn', require('./src/nw-save-btn'))
  .directive('nwDeleteBtn', require('./src/nw-delete-btn'))

  .directive('nwNavbar', require('./src/nw-navbar'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwItem', require('./src/nw-item'))
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