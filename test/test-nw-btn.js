'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-btn', function(){
  var
    $element = example(
      '<nw-btn></nw-btn>' +
      '<nw-btn type="primary"></nw-btn>'
    ),

    btn = $element.find('.btn'),

    btnDefault = $element.find('.btn.btn-default'),
    btnPrimary = $element.find('.btn.btn-primary')
  ;

  it('renders .btn', function(){
    assert.equal(btn.length, 2);
  });

  it('.btn-default in no [type] was given', function(){
    assert.equal(btnDefault.length, 1);
    assert.equal(btnPrimary.length, 1);
  });
});