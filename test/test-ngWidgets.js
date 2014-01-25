'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('ngWidgets', function(){
  var
    el = example(
      '<nw-panel name="{{ panelName }}">' +
      '  <nw-field label="Panel name">' +
      '    <input ng-model=" panelName ">' +
      '  </nw-field>' +
      '</nw-panel>'
    ),
    panelHeading = el.find('.panel-heading')
  ;

  it('complex example', function(){
    assert(panelHeading.hasClass('ng-hide'));

    el.scope().panelName = 'Test';
    el.scope().$apply();

    assert( ! panelHeading.hasClass('ng-hide'));
    assert.equal(panelHeading.text(), el.scope().panelName);
  });
});