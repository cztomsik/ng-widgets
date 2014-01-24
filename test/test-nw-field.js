'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-field', function(){
  var
    el = example('<nw-field label="Email"><input type="email" ng-model=" email "></nw-field>'),
    formGroup = el.find('.form-group'),
    controlLabel = el.find('.control-label'),
    input = el.find('input'),
    ngModel = input.controller('ngModel')
  ;

  it('renders .form-group', function(){
    assert(formGroup.length);
  });

  it('shows [label] in .control-label', function(){
    assert( ! controlLabel.hasClass('ng-hide'));
    assert.equal(controlLabel.text(), 'Email');
  });

  it('.control-label hidden when empty', function(){
    el.isolateScope().label = '';
    el.isolateScope().$apply();

    assert(controlLabel.hasClass('ng-hide'));
  });

  it('at first no error is shown', function(){
    assert( ! formGroup.hasClass('has-error'));
  });

  it('when dirty, invalid field gets .has-error', function(){
    ngModel.$setViewValue('test');
    el.scope().$apply();

    assert(formGroup.hasClass('has-error'));
  });

  it('adds .form-control to textarea, select, and inputs', function(){
    var
      el = example(
        '<nw-field>' +
        '  <input>' +
        '  <select>' +
        '  <textarea></textarea>' +
        '</nw-field>'
      ),
      formControls = el.find('.form-control')
    ;

    assert.equal(formControls.length, 3);
  });

  it('ommits adding .form-control for radios and checkboxes', function(){
    var
      el = example(
        '<nw-field>' +
        '  <input type="radio">' +
        '  <input type="checkbox">' +
        '</nw-field>'
      ),
      formControls = el.find('.form-control')
    ;

    assert( ! formControls.length);
  });
});