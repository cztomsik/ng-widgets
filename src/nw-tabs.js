'use strict';

var angular = require('angular');

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model=" activeTab "></nw-list>' +
      '<content></content>',

    controller: function($scope){
      $scope.tabs = [];

      $scope.$watch('activeTab', function(activeTab){
        $scope.tabs.forEach(function(tab){
          tab.active = (tab === activeTab);
        });
      });
    },

    link: function($scope, $element){
      //initialize using elements
      var tabEls = $element.find('nw-tab');

      //TODO: this is nasty, would be much better to get all hostElement scopes in array
      angular.forEach(tabEls, function(tabEl){
        $scope.tabs.push(angular.element(tabEl).isolateScope());
      });

      $scope.activeTab = $scope.tabs[0];
    }
  });
};