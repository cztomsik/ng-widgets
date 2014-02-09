'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('content', function(){
  var
    $element = example('<test><div ng-init=" changed = true ">Hello</div></test>', withTestDirective),
    $scope = $element.scope()
  ;

  it('transcludes content', function(){
    assert.equal($element.text(), 'Hello world');
  });

  it('uses parent scope', function(){
    assert($scope.changed);
  });

  function withTestDirective($compileProvider){
    $compileProvider.directive('test', function(ngWidget){
      return ngWidget({
        template: '<content></content> world'
      });
    });
  }
});