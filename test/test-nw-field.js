'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-field', function(){
  var
    el = example('<nw-field label="Name"><input ng-model=" name "></nw-field>'),
    formGroup = el.find('.form-group'),
    controlLabel = el.find('.control-label'),
    input = el.find('input')
  ;

  it('renders .form-group', function(){
    assert(formGroup.length);
  });

  it('shows [label] in .control-label', function(){
    assert( ! controlLabel.hasClass('ng-hide'));
    assert(controlLabel.text() === 'Name');
  });

  it('adds .form-control class to inputs', function(){
    assert(input.hasClass('form-control'));
  });

  it('.control-label hidden when empty', function(){
    el.isolateScope().label = '';
    el.isolateScope().$apply();

    assert(controlLabel.hasClass('ng-hide'));
  });
});