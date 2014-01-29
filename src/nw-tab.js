'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>',

    link: function($scope, $element){
      var nwTabsEl = $element.parent().parent();

      nwTabsEl.isolateScope().tabs.push($scope);
    }
  });
};