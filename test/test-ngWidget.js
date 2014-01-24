'use strict';

var
  assert = require('assert'),
  ngWidget = require('../src/ngWidget')
;

describe('ngWidget()', function(){
  it('returns preinitialized directive definition', function(){
    var definition = ngWidget();

    assert.equal(definition.restrict, 'E');
    assert.strictEqual(definition.template, '');
    assert.strictEqual(definition.transclude, true);
    assert.deepEqual(definition.scope, {});

    //do the magic
    assert(definition.compile);
  });

  it('defaults can be overridden', function(){
    var definition = ngWidget({
      restrict: 'EA'
    });

    assert.equal(definition.restrict, 'EA');
  });

  //so we can unit test prelink
  it('references prelink() & link() methods from compile', function(){
    //TODO:
  });

  it('binds all attributes to scope', function(){
    var
      definition = ngWidget({
        template: '{{ hello }}'
      }),
      $element = null,
      $attrs = {hello: 'test', $attr: {hello: 'hello'}},
      $scope = {}
    ;

    definition.prelink($scope, $element, $attrs);

    assert.equal($scope.hello, 'test');
  });
});