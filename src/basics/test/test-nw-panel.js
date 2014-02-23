'use strict';

var
  assert = require('assert'),
  example = require('../../example')
;

describe('<nw-panel', function(){
  var
    $element = example(
      '<nw-panel>' +
      '  Nameless panel' +
      '</nw-panel>' +
      '<br>' +
      '<nw-panel type="primary" name="Named panel">' +
      '  Panel body' +
      '</nw-panel>'
    ),
    panel = $element.find('.panel'),

    panelDefault = $element.find('.panel.panel-default'),
    panelPrimary = $element.find('.panel.panel-primary'),

    defaultHeading = panelDefault.find('.panel-heading'),
    primaryHeading = panelPrimary.find('.panel-heading'),

    defaultBody = panelDefault.find('.panel-body'),
    primaryBody = panelPrimary.find('.panel-body')
  ;

  it('renders .panel', function(){
    assert.strictEqual(panel.length, 2);
  });

  it('.panel-default if no [type] was given', function(){
    assert.strictEqual(panelDefault.length, 1);
    assert.strictEqual(panelPrimary.length, 1);
  });

  it('shows [name] in .panel-heading', function(){
    assert(defaultHeading.hasClass('ng-hide'));
    assert.strictEqual(defaultHeading.text(), '');

    assert( ! primaryHeading.hasClass('ng-hide'));
    assert.strictEqual(primaryHeading.text(), 'Named panel');
  });

  it('shows content in .panel-body', function(){
    assert.strictEqual(defaultBody.text().trim(), 'Nameless panel');
    assert.strictEqual(primaryBody.text().trim(), 'Panel body');
  });
});