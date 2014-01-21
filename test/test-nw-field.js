'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-field', function(){
  var
    el = example('<nw-field label="Name"><input ng-model=" name "></nw-field>')
  ;

  it('represents bootstrap form-group', function(){
    assert(el.qsa('.form-group').length, 'no .form-gorup was found');
  });

  it('set label proper element', function(){
    assert(el.qsa('label').text() === 'Name', 'label does not have correct text');
  });

  it('should add .form-control class to child input', function(){
    assert(el.qsa('input').hasClass('form-control'), 'input does not have .form-control class');
  });
});