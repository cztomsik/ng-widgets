'use strict';

var
  assert = require('assert'),
  $injector = require('../../injector'),
  $compileProvider = $injector.get('$compileProvider'),
  example = require('../../example'),
  ngWidget = require('../../utils/ng-widget')
;

describe('ngWidget()', function(){
  it('returns preinitialized directive definition', function(){
    var definition = ngWidget();

    assert.strictEqual(definition.restrict, 'E');
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

    assert.strictEqual(definition.restrict, 'EA');
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
    $compileProvider.directive('testLink', function(ngWidget){
      return ngWidget({
        link: done.bind(null, null)
      });
    });

    example('<test-link></test-link>');
  });

  it('binds text attributes to scope', function(){
    $compileProvider.directive('testAttrs', function(ngWidget){
      return ngWidget({
        template: '{{ hello }} {{ world }}'
      });
    });

    var
      $element = example('<test-attrs hello="Hello" world="{{ world }}"></test-attrs>', {world: 'world'})
    ;

    assert.strictEqual($element.text(), 'Hello world');
  });

  it('$scope is initialized with copy of definition.defaults', function(){
    var
      arrInstance = [],
      $innerScope
    ;

    $compileProvider.directive('testDefaults', function(ngWidget){
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

    example('<test-defaults></test-defaults>');

    assert.strictEqual($innerScope.emptyText, 'No items');
    assert.deepEqual($innerScope.items, []);
    assert($innerScope.items !== arrInstance, 'array copy expected');
  });

  //TODO:
  //  rethink once again
  //  $log.error if content was not used anywhere
  //  autotransclude does not work because of require: ^form in ngModel

  // it('content is transcluded even if there are no insertion points', function(){
  //   var
  //     wasCalled = false
  //   ;

  //   $compileProvider.directive('test', function(ngWidget){
  //     return ngWidget();
  //   });

  //   $compileProvider.directive('param', function(ngWidget){
  //     return ngWidget({
  //       controller: function(){
  //         wasCalled = true;
  //       }
  //     });
  //   });

  //   example('<test><param></param></test>');

  //   assert(wasCalled);
  // });

  it('transcluded contents can still require parent controllers', function(){
    var
      $element = example(
        '<form name=" testForm ">' +
        '  <nw-field>' +
        '    <input ng-model="test" required>' +
        '  </nw-field>' +
        '</form>'
      ),
      $scope = $element.scope()
    ;

    assert($scope.testForm.$invalid, 'field not registered');
  });
});