'use strict';

var
  angular = require('angular')
;

module.exports = WidgetDefinition;

function WidgetDefinition(cfg){
  if ((this === global) || (this === undefined)){
    return new WidgetDefinition(cfg);
  }

  angular.extend(this, cfg);
}

WidgetDefinition.prototype = {
  restrict: 'E',
  template: '',
  transclude: true,
  scope: {},
  defaults: {},

  //actual stuff
  compile: function(){
    return {
      pre: this.prelink.bind(this),
      post: this.link && this.link.bind(this)
    };
  },

  prelink: function($scope, $element, $attrs){
    angular.extend($scope, angular.copy(this.defaults));

    for (var k in $attrs.$attr){
      $scope[k] = $attrs[k];

      //TODO: test (partially covered by nw-* widgets)
      //array-like special case
      if (angular.isArray(this.defaults[k])){
        $scope[k] = $scope.$parent.$eval($attrs[k]);
        $scope.$parent.$watchCollection($attrs[k], dotSet($scope, k));
        continue;
      }

      if ($attrs.$$observers && $attrs.$$observers[k]){
        $attrs.$observe(k, dotSet($scope, k));
      }
    }
  }
};

function dotSet(obj, prop){
  return function(val){
    obj[prop] = val;
  };
}