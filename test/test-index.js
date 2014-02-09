'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('ngWidgets', function(){
  var
    $element = example(
      '<nw-panel name="{{ panelName }}">' +
      '  <nw-field label="Panel name">' +
      '    <input ng-model=" panelName ">' +
      '  </nw-field>' +
      '</nw-panel>'
    ),
    $scope = $element.scope(),
    panelHeading = $element.find('.panel-heading')
  ;

  it('complex example', function(){
    assert(panelHeading.hasClass('ng-hide'));

    $scope.panelName = 'Test';
    $scope.$apply();

    assert( ! panelHeading.hasClass('ng-hide'));
    assert.equal(panelHeading.text(), $scope.panelName);
  });
});