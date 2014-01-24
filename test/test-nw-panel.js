'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-panel', function(){
  var
    el = example('<nw-panel name="Hello">Hello world!</nw-panel>'),
    panel = el.find('.panel'),
    panelHeading = el.find('.panel-heading'),
    panelBody = el.find('.panel-body')
  ;

  it('renders .panel', function(){
    assert(panel.length);
  });

  it('shows [name] in .panel-heading', function(){
    assert( ! panelHeading.hasClass('ng-hide'));
    assert(panelHeading.text() === 'Hello');
  });

  it('shows content in .panel-body', function(){
    assert(panelBody.text().trim() === 'Hello world!');
  });

  it('.panel-heading hidden when empty', function(){
    el.isolateScope().name = '';
    el.isolateScope().$apply();

    assert(panelHeading.hasClass('ng-hide'));
  });
});