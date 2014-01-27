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

  it('definition defaults can be overridden', function(){
    var definition = ngWidget({
      restrict: 'EA'
    });

    assert.equal(definition.restrict, 'EA');
  });

//  it('appends styles to head', function(){
//    global.document = {head}
//    ngWidget({style: ''});
//  });

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

  it('$scope is initialized with copy of definition.defaults during prelink phase', function(){
    var
      arrInstance = [],
      definition = ngWidget({
        defaults: {
          items: arrInstance,
          emptyText: 'No items'
        }
      }),
      $scope = {}
    ;

    definition.prelink($scope, null, {});

    assert.equal($scope.emptyText, 'No items');
    assert.deepEqual($scope.items, []);
    assert($scope.items !== arrInstance, 'array copy expected');
  });
});