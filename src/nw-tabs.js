'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model="activeTab" autoselect></nw-list>' +
      '<content></content>',

    tabs: [],

    init: function(){
      //do not share
      this.tabs = [];
    }
  });
};