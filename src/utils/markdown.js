'use strict';

//TODO: test
try{
  var
    angular = require('angular'),
    showdown = require('showdown'),
    converter = new showdown.converter(),
    makeHtml = converter.makeHtml.bind(converter)
  ;
} catch(e){
  makeHtml = angular.identity;
}

module.exports = function($sce, $log){
  if ( ! showdown){
    $log.error('Showdown library not available.');
  }

  return function(source){
    return source && $sce.trustAsHtml(makeHtml(source));
  };
};