'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<div class="panel panel-default">' +
    '  <div class="panel-heading" ng-show=" heading ">{{ heading }}</div>' +
    '  <div class="panel-body">' +
    '    <content></content>' +
    '  </div>' +
    '</div>',
  transclude: true,
  scope: {
    heading: '@'
  }
};