'use strict';

var
  _ = require('./utils')
;

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model=" activeTab "></nw-list>' +
      '<content></content>',

    defaults: {
      tabs: [],
      activeTab: null
    },

    controller: function($scope){
      var
        tabsCtrl = this
      ;

      tabsCtrl.addTab = function(tab){
        $scope.tabs.push(tab);
      };

      tabsCtrl.removeTab = function(tab){
        _.pull($scope.tabs, tab);
      };

      //TODO: autoselect
      $scope.$watchCollection('tabs', function(tabs){
        $scope.activeTab = $scope.activeTab || tabs[0];
      });

      $scope.$watch('activeTab', function(activeTab){
        $scope.tabs.forEach(function(tab){
          tab.active = (tab === activeTab);
        });
      });
    }
  });
};