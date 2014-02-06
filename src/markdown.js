'use strict';

var
  showdown = require('showdown'),
  converter = new showdown.converter()
;

module.exports = function($sce){
  return function(source){
    return source && $sce.trustAsHtml(converter.makeHtml(source));
  };
};