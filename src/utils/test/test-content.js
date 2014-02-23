'use strict';

var
  assert = require('assert'),
  $injector = require('../../injector'),
  $compileProvider = $injector.get('$compileProvider'),
  example = require('../../example')
;

describe('content', function(){
  $compileProvider.directive('testContent', function(ngWidget){
    return ngWidget({
      template: '<content ng-if=" world "></content> {{ world }}',

      defaults: {
        world: ''
      }
    });
  });

  var
    $element = example('<test-content world="world">{{ hello }}</test-content>', {hello: 'Hello'})
  ;

  it('represents insertion point for widget content', function(){
    assert.strictEqual($element.text().trim(), 'Hello world');
  });
});