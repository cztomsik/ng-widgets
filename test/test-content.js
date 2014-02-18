'use strict';

var
  assert = require('assert'),
  $injector = require('./runner/injector'),
  $compileProvider = $injector.get('$compileProvider'),
  example = require('./runner/example')
;

describe('content', function(){
  $compileProvider.directive('testContent', function(ngWidget){
    return ngWidget({
      template: '<content></content> world'
    });
  });

  var
    $element = example('<test-content><div ng-init=" changed = true ">Hello</div></test-content>'),
    $scope = $element.scope()
  ;

  it('represents insertion point for widget content', function(){
    assert.strictEqual($element.text(), 'Hello world');
  });

  it('uses internal $host property, containing automatically transcluded content within **parent** scope', function(){
    assert($scope.changed);
  });
});