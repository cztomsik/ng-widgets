'use strict';

var
  assert = require('assert'),
  angular = require('angular'),

  ngWidgets = require('..')
;

describe('content', function(){
  var
    $injector = angular.bootstrap('<test><div ng-init=" changed = true ">Hello</div></test>', [ngWidgets.name, withTestDirective]),
    $rootScope = $injector.get('$rootScope'),
    el = $injector.get('$rootElement')
  ;

  it('transcludes content', function(){
    assert(el.text() === 'Hello world');
  });

  it('uses parent scope', function(){
    assert($rootScope.changed);
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