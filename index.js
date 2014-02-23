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
  angular.element.prototype.find = require('./src/utils/qsa.js');
}

ngWidgets
  .value('ngWidget', require('./src/utils/ng-widget.js'))
  .filter('markdown', require('./src/utils/markdown.js'))
  .directive('content', require('./src/utils/content'))
  .directive('nwLipsum', require('./src/utils/nw-lipsum'))


  .directive('nwBtn', require('./src/basics/nw-btn'))
  .directive('nwNavbar', require('./src/basics/nw-navbar'))
  .directive('nwList', require('./src/basics/nw-list'))
  .directive('nwItem', require('./src/basics/nw-item'))
  .directive('nwPanel', require('./src/basics/nw-panel'))
  .directive('nwModal', require('./src/basics/nw-modal'))
  .directive('nwGrid', require('./src/basics/nw-grid'))
  .directive('nwGridCol', require('./src/basics/nw-grid-col'))
  .directive('nwTabs', require('./src/basics/nw-tabs'))
  .directive('nwTab', require('./src/basics/nw-tab'))

  .directive('nwField', require('./src/forms/nw-field'))
  .directive('nwSaveBtn', require('./src/forms/nw-save-btn'))
  .directive('nwDeleteBtn', require('./src/forms/nw-delete-btn'))
;