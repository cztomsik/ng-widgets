'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('nw-row', function(){
  var
    el = example(
      '<nw-row item-class="col-md-4">' +
      '  <nw-field label="First name"><input></nw-field>' +
      '  <nw-field label="Last name"><input></nw-field>' +
      '</nw-row>'
    ),
    row = el.find('.row'),
    fields = el.find('nw-field'),
    cols = el.find('.col-md-4')
  ;

  it('renders .row with transcluded contents', function(){
    assert(row.length);
    assert(fields.length === 2);
  });

  it('appends itemClass to all children', function(){
    assert(cols.length == 2);
  });
});