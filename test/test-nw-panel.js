'use strict';

var
  assert = require('assert'),
  angular = require('angular'),
  ngWidgets = require('..'),

  $injector = angular.injector(['ng', 'ngWidgets']),
  $scope = $injector.get('$rootScope').$new(true),
  $compile = $injector.get('$compile')
;

describe('nw-panel', function(){
  var element = angular.element(
    '<nw-panel>Test</nw-panel>'
  );

  $compile(element)($scope);

  it('represents bootstrap panel', function(){
    assert(element.qsa('nw-panel .panel').length, 'no .panel was found');
  });
});