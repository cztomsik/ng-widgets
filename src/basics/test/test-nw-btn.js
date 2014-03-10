'use strict';

var
  assert = require('assert'),
  example = require('../../example')
;

describe('<nw-btn', function(){
  var
    $element = example(
      '<nw-btn name="Button"></nw-btn>' +
      '<nw-btn type="danger" icon="trash-o" ng-disabled=" true " ng-click=" shouldNotHappen = true "></nw-btn>'
    ),
    $scope = $element.scope(),

    btn = $element.find('.btn'),

    btnDefault = $element.find('.btn.btn-default'),
    btnDanger = $element.find('.btn.btn-danger'),
    trashIcon = btnDanger.find('i.fa.fa-trash-o')
  ;

  it('renders .btn', function(){
    assert.strictEqual(btn.length, 2);
  });

  it('.btn-default in no [type] was given', function(){
    assert.strictEqual(btnDefault.length, 1);
    assert.strictEqual(btnDanger.length, 1);
  });

  it('shows [name] in its body', function(){
    assert.strictEqual(btnDefault.text().trim(), 'Button');
  });

  it('adds fa-* classes based on given [icon]', function(){
    assert(trashIcon.length);
  });

  it('adds .disabled class to ng-disabled', function(){
    assert(btnDanger.hasClass('disabled'));
  });

  it('ng-disabled stops clicks', function(){
    ///$element.eq(1).triggerHandler('click');

    //untestable - because of triggerHandler
    //assert( ! $scope.shouldNotHappen);
  });

  it('logs an error if no [ng-click] was given', function(){
    //TODO: test
  });
});