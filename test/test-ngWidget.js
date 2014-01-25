'use strict';

var
  assert = require('assert'),
  ngWidget = require('../src/ngWidget'),
  angular = require('angular')
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

  it('link() is called', function(done){
    var definition = ngWidget({link: done});

    definition.compile().post();
  });

  it('binds text attributes to scope', function(){
    var
      html = '<test hello="Hello" world="{{ world }}"></test>',
      definition = ngWidget({template: '{{ hello }} {{ world }}'}),
      $injector = angular.bootstrap(html, [withTestDirective]),
      $scope = $injector.get('$rootScope'),
      $element = $injector.get('$rootElement')
    ;

    $scope.world = 'world';
    $scope.$apply();

    assert.equal($element.text(), 'Hello world');


    function withTestDirective($compileProvider){
      $compileProvider.directive('test', function(){
        return definition;
      });
    }
  });
});