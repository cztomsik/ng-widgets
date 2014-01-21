'use strict';

var
  angular = require('angular'),

  testCaseElement
;

module.exports = {
  html: function(html){
    testCaseElement = angular.element(html);
  },

  find: function(){
    return testCaseElement.find.apply(testCaseElement, arguments);
  }
};