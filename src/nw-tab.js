'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" parentTabsScope.activeTab == this "></content>',

    name: '',

    init: function($element){
      this.parentTabsScope = $element.parent().parent().isolateScope();
      this.parentTabsScope.tabs.push(this);
    }
  });
};