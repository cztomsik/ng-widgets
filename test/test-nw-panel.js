'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-panel', function(){
  var
    el = example('<nw-panel name="Hello">Hello world!</nw-panel>'),
    panel = el.find('.panel'),
    panelHeading = el.find('.panel-heading')
  ;

  it('renders .panel', function(){
    assert(panel.length);
  });

  it('shows [name] in .panel-heading', function(){
    assert( ! panelHeading.hasClass('ng-hide'));
    assert(panelHeading.text() === 'Hello');
  });

  it('.panel-heading hidden when empty', function(){
    el.isolateScope().name = '';
    el.isolateScope().$apply();

    assert(panelHeading.hasClass('ng-hide'));
  });
});