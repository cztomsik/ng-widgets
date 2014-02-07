'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-btn', function(){
  var
    el = example('<nw-btn></nw-btn>'),
    btn = el.find('.btn')
  ;

  it('renders .btn', function(){
    assert(btn.length);
  });

  it('supports .btn type', function(){
    assert(btn.hasClass('btn-default'));

    el.isolateScope().type = 'primary';
    el.isolateScope().$apply();

    assert(btn.hasClass('btn-primary'));
  });
});