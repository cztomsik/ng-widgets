'use strict';

var angular = require('angular');

module.exports = function(selector){
  return angular.element([].map.call(this, function(el){
    return el.querySelectorAll(selector);
  }));
};