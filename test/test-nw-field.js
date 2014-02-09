'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-field', function(){
  var
    $element = example(
      '<nw-field label="Email">' +
      '  <input type="email" ng-model=" email ">' +
      '</nw-field>' +
      '<br>' +
      '<nw-field><textarea></textarea></nw-field>' +
      '<nw-field><select></select></nw-field>' +
      '<nw-field><input type="checkbox"></nw-field>' +
      '<nw-field><input type="radio"></nw-field>'
    ),

    formGroup = $element.find('.form-group'),
    emailLabel = formGroup.eq(0).find('.control-label'),
    textareaLabel = formGroup.eq(1).find('.control-label'),

    email = $element.find('input[type="email"]'),
    textarea = $element.find('textarea'),
    select = $element.find('select'),
    radio = $element.find('input[type="radio"]'),
    checkbox = $element.find('input[type="checkbox"]')
  ;

  it('renders .form-group', function(){
    assert.equal(formGroup.length, 5);
  });

  it('shows [label] in .control-label', function(){
    assert(! emailLabel.hasClass('ng-hide'));
    assert.equal(emailLabel.text(), 'Email');

    assert(textareaLabel.hasClass('ng-hide'));
    assert.equal(textareaLabel.text(), '');
  });

  it('adds .form-control to controls, excluding radios & checkboxes', function(){
    assert(email.hasClass('form-control'));
    assert(textarea.hasClass('form-control'));
    assert(select.hasClass('form-control'));

    assert( ! radio.hasClass('form-control'));
    assert( ! checkbox.hasClass('form-control'));
  });

  it('at first no error is shown', function(){
    assert( ! formGroup.hasClass('has-error'));
  });

  it('when dirty, invalid field gets .has-error', function(){
    email.val('err').triggerHandler('change');

    assert(formGroup.hasClass('has-error'));
  });
});