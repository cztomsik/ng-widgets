'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-row', function(){
  var
    $element = example(
      '<nw-row item-class="col-sm-4">' +
      '  <nw-field label="First name">' +
      '    <input>' +
      '  </nw-field>' +
      '  <nw-field label="Last name">' +
      '    <input>' +
      '  </nw-field>' +
      '</nw-row>'
    ),
    row = $element.find('.row'),
    fields = $element.find('nw-field'),
    cols = $element.find('.col-sm-4')
  ;

  it('renders .row with transcluded contents', function(){
    assert.strictEqual(row.length, 1);
    assert.strictEqual(fields.length, 2);
  });

  it('appends itemClass to all children', function(){
    assert.strictEqual(cols.length, 2);
  });
});