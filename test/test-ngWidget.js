'use strict';

var
  assert = require('assert'),
  ngWidget = require('../src/ngWidget')
;

describe('ngWidget()', function(){
  it('returns preinitialized directive definition', function(){
    var dirDef = ngWidget();

    assert(dirDef.restrict === 'E');
    assert(dirDef.template === '');
    assert(dirDef.transclude === true);
    assert.deepEqual(dirDef.scope, {});

    //do the magic
    //assert(dirDef.compile);
  });

  it('defaults can be overridden', function(){
    var dirDef = ngWidget({
      restrict: 'EA'
    });

    assert(dirDef.restrict === 'EA');
  });
});