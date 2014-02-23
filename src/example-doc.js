'use strict';

var
  example = require('./example'),
  exampleModule = require.cache[require.resolve('./example')]
;

exampleModule.exports = function(html){
  global.before(function(){
    console.log('<example><div>', html, '</div><pre ng-non-bindable>' + format(html) + '</pre>', '</example>');
  });

  return example.apply(this, arguments);
};

function format(html){
  if ( ~ html.indexOf('  ')){
    html = html.replace(/>/g, '>\n');
  }

  return (
    html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  );
}