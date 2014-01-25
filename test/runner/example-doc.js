'use strict';

var
  example = require('./example'),
  exampleModule = require.cache[require.resolve('./example')]
;

exampleModule.exports = function(html){
  global.before(function(){
    console.log('<example>' + html + '</example>');
  });

  return example(html);
};