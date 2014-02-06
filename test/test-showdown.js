'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('showdown', function(){
  var
    el = example('<div ng-bind-html=" str | markdown "></div>'),
    $scope = el.scope()
  ;

  $scope.str = '**test**';
  $scope.$apply();

  it('renders showdown markup', function(){
    assert.equal(el.html(), '<p><strong>test</strong></p>');
  });
});