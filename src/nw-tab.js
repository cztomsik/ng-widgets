'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>'
  });
};