'use strict';

var angular = require('angular');

module.exports = function(widgetDef){
  //TODO: make it overridable (timeout?)
  if (widgetDef.style){
    angular.element('head').append(angular.element('<style></style>').html(widgetDef.style));
  }

  return {
    restrict: 'E',
    template: widgetDef.template || '',
    transclude: true,
    scope: {},
    controller: widgetCtrl(widgetDef),

    //TODO: consider extending directiveDefinitionObject & separating from defaults
    widgetDef: widgetDef
  };
};

function widgetCtrl(widgetDef){
  return function($scope, $element, $attrs, $transclude, $injector){
    angular.extend($scope, widgetDef);

    setupWatches($scope, $attrs, widgetDef);

    if ($scope.init){
      $scope.$$postDigest(function(){
        $injector.invoke($scope.init, $scope, {$element: $element, $attrs: $attrs, $scope: $scope, $transclude: $transclude});
      });
    }
  };
}

function setupWatches($scope, $attrs, widgetDef){
  //TODO: include prototype chain
  Object.keys(widgetDef).forEach(function(k){
    //preserve defaults
    if ($attrs[k] === undefined){
      return;
    }

    //two-way bound because of object references
    if (angular.isObject(widgetDef[k])){

      //special case array-like
      if ('length' in widgetDef[k]){
        return $scope.$watchCollection('$parent.' + $attrs[k], function(coll){
          $scope[k] = coll;
        });
      }

      return $scope.$watch('$parent.' + $attrs[k], function(val){
        $scope[k] = val;
      });
    }

    //one-way boolean
    if (typeof widgetDef[k] === 'boolean'){

      //static binary attribute (autofocus, etc.)
      if ($attrs[k] === ''){
        $scope[k] = k;
        return;
      }

      //expression otherwise
      //TODO: trim
      return $scope.$watch('$parent.' + $attrs[k], function(val){
        $scope[k] = (!! val) && k;
      });
    }

    //one-way number
    if (angular.isNumber(widgetDef[k])){
      return $attrs.$observe(k, function(val){
        $scope[k] = +val;
      });
    }

    //one-way
    $attrs.$observe(k, function(val){
      $scope[k] = val;
    });
  });
}
