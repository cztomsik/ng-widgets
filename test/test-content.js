'use strict';

var
  assert = require('assert'),
  angular = require('angular'),

  ngWidgets = require('..')
;

describe('content', function(){
  var
    html = '<test><div ng-init=" changed = true ">Hello</div></test>',
    $injector = angular.bootstrap(html, [ngWidgets.name, withTestDirective]),
    $scope = $injector.get('$rootScope'),
    el = $injector.get('$rootElement')
  ;

  it('transcludes content', function(){
    assert.equal(el.text(), 'Hello world');
  });

  it('uses parent scope', function(){
    assert($scope.changed);
  });

  function withTestDirective($compileProvider){
    $compileProvider.directive('test', angular.identity.bind(null, {
      restrict: 'E',
      template: '<content></content> world',
      transclude: true,
      scope: {}
    }));
  }
});