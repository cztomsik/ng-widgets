'use strict';

var
  assert = require('assert'),
  example = require('./runner/example')
;

describe('<nw-btn', function(){
  var
    $element = example(
      '<nw-btn name="Button"></nw-btn>' +
      '<nw-btn type="danger" icon="trash-o"></nw-btn>'
    ),

    btn = $element.find('.btn'),

    btnDefault = $element.find('.btn.btn-default'),
    btnDanger = $element.find('.btn.btn-danger'),
    trashIcon = btnDanger.find('i.fa.fa-trash-o')
  ;

  it('renders .btn', function(){
    assert.equal(btn.length, 2);
  });

  it('.btn-default in no [type] was given', function(){
    assert.equal(btnDefault.length, 1);
    assert.equal(btnDanger.length, 1);
  });

  it('shows [name] in its body', function(){
    assert.equal(btnDefault.text().trim(), 'Button');
  });

  it('adds fa-* classes based on given [icon]', function(){
    assert(trashIcon.length);
  });
});