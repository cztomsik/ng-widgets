'use strict';

/* global angular */
angular
  .module('ngWidgets', [])

  .value('ngWidget', function(proto){
    if (proto.style){
      angular.element(document.head).append('<style>' + proto.style + '</style>');
    }

    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      priority: -1,
      template: proto.template || '',

      //automatic scope <-> attribute binding
      //meant to be an alternative to angularjs directive definition object
      controller: function($scope, $element, $attrs, $transclude, $injector){
        angular.extend($scope, proto);

        //TODO: include prototype chain
        Object.keys(proto).forEach(function(k){
          //preserve defaults
          if ($attrs[k] === undefined){
            return;
          }

          //two-way bound because of object references
          if (angular.isObject(proto[k])){

            //special case array-like
            if ('length' in proto[k]){
              return $scope.$watchCollection('$parent.' + $attrs[k], function(coll){
                $scope[k] = coll;
              });
            }

            return $scope.$watch('$parent.' + $attrs[k], function(val){
              $scope[k] = val;
            });
          }

          //one-way boolean
          if (typeof proto[k] === 'boolean'){

            //static binary attribute (autofocus, etc.)
            if ($attrs[k] === ''){
              $scope[k] = k;
              return;
            }

            //expression otherwise
            return $scope.$watch('$parent.' + $attrs[k], function(val){
              $scope[k] = (!! val) && k;
            });
          }

          //one-way number
          if (angular.isNumber(proto[k])){
            return $attrs.$observe(k, function(val){
              $scope[k] = +val;
            });
          }

          //one-way
          $attrs.$observe(k, function(val){
            $scope[k] = val;
          });
        });

        if ($scope.init){
          $injector.invoke($scope.init, $scope, {$element: $element, $attrs: $attrs, $scope: $scope, $transclude: $transclude});
        }
      }
    };
  })

  .directive('content', require('./src/content'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwField', require('./src/nw-field'))
  .directive('nwPanel', require('./src/nw-panel'))

  .directive('nwGrid', require('./src/nw-grid'))
  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
  .directive('nwTab', require('./src/nw-tab'))
;