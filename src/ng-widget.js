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

  prelink: function($scope, $element, $attrs, ctrls, $transclude){
    angular.extend($scope, angular.copy(this.defaults));

    for (var k in $attrs.$attr){
      $scope[k] = $attrs[k];

      //TODO: test (partially covered by nw-* widgets)
      //most wanted
      if (this.defaults[k] instanceof Object){
        $scope[k] = $scope.$parent.$eval($attrs[k]);
        $scope.$parent.$watchCollection($attrs[k], dotSet($scope, k));
        continue;
      }

      //string interpolation
      if ($attrs.$$observers && $attrs.$$observers[k]){
        $attrs.$observe(k, dotSet($scope, k));
      }
    }

    //always transclude - this makes tracing bugs little easier
    $transclude($scope.$parent, function(contents){
      //scope is the least evil, in future this will get replaced by shadow DOM + polyfill
      $scope.$host = $element.clone().html('').append(contents);
    });
  }
};

function dotSet(obj, prop){
  return function(val){
    obj[prop] = val;
  };
}