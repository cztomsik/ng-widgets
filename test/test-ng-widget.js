'use strict';

var
  assert = require('assert'),
  example = require('./runner/example'),
  ngWidget = require('../src/ngWidget')
;

describe('ngWidget()', function(){
  it('returns preinitialized directive definition', function(){
    var definition = ngWidget();

    assert.equal(definition.restrict, 'E');
    assert.strictEqual(definition.template, '');
    assert.strictEqual(definition.transclude, true);
    assert.deepEqual(definition.scope, {});
    assert.deepEqual(definition.defaults, {});

    //do the magic
    assert.strictEqual(definition.controller, undefined);
    assert(definition.compile);
  });

  it('definition defaults can be overridden', function(){
    var definition = ngWidget({
      restrict: 'EA'
    });

    assert.equal(definition.restrict, 'EA');
  });

//TODO
//  it('returns registered definition by name', function(){
//    //return $injector.get(name + 'Directive')[0]
//  });

//  it('appends styles to head', function(){
//    global.document = {head}
//    ngWidget({style: ''});
//  });

  it('link() is called', function(done){
    example('<test></test>', function($compileProvider){
      $compileProvider.directive('test', function(ngWidget){
        return ngWidget({
          link: done.bind(null, null)
        });
      });
    });
  });

  it('binds text attributes to scope', function(){
    var
      $element = example('<test hello="Hello" world="{{ world }}"></test>', withTestDirective),
      $scope = $element.scope()
    ;

    $scope.world = 'world';
    $scope.$apply();

    assert.equal($element.text(), 'Hello world');


    function withTestDirective($compileProvider){
      $compileProvider.directive('test', function(ngWidget){
        return ngWidget({
          template: '{{ hello }} {{ world }}'
        });
      });
    }
  });

  it('$scope is initialized with copy of definition.defaults', function(){
    var
      arrInstance = [],
      $innerScope
    ;

    example('<test></test>', function($compileProvider){
      $compileProvider.directive('test', function(ngWidget){
        return ngWidget({
          defaults: {
            items: arrInstance,
            emptyText: 'No items'
          },

          controller: function($scope){
            $innerScope = $scope;
          }
        });
      });
    });

    assert.equal($innerScope.emptyText, 'No items');
    assert.deepEqual($innerScope.items, []);
    assert($innerScope.items !== arrInstance, 'array copy expected');
  });

  it('content is transcluded even if there are no insertion points', function(){
    var
      wasCalled = false
    ;

    example('<test><param></param></test>', function($compileProvider){
      $compileProvider.directive('test', function(ngWidget){
        return ngWidget();
      });

      $compileProvider.directive('param', function(ngWidget){
        return ngWidget({
          controller: function(){
            wasCalled = true;
          }
        });
      });
    });

    assert(wasCalled);
  });
});