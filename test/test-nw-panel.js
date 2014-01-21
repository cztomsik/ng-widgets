'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-panel', function(){
  var
    el = example('<nw-panel name="{{ name }}">Hello world</nw-panel>')
  ;

  it('represents bootstrap panel', function(){
    assert(el.qsa('.panel').length, 'no .panel was found');
  });

  it('does not show heading by default', function(){
    assert(el.qsa('.panel-heading').hasClass('ng-hide'), 'heading not hidden');
  });

  it('shows its name in heading', function(){
    el.scope().name = 'not empty';
    el.scope().$apply();

    assert( ! el.find('.panel-heading').hasClass('ng-hide'), 'heading not shown');
  });
});