(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./src/content":2,"./src/nw-field":3,"./src/nw-grid":5,"./src/nw-grid-col":4,"./src/nw-list":6,"./src/nw-panel":7,"./src/nw-tab":8,"./src/nw-tabs":9}],2:[function(require,module,exports){
'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    controller: function($scope, $element, $transclude){
      $transclude($scope.$parent, $element.append.bind($element));
    }
  };
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
      '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
      '  <content></content>' +

      '  <p class="help-block">' +
      '    {{ help }}' +
      '  </p>' +

      '  <ul class="help-block" ng-show=" ngModel.$dirty " style=" font-weight: bold ">' +
      '    <li ng-repeat=" (k, e) in ngModel.$error " ng-show=" e ">This field is {{ k }}</li>' +
      '  </ul>' +
      '</div>',

    label: '',
    help: '',

    init: function($scope, $element, $timeout){
      $timeout(function(){
        $scope.ngModel = $element.find('content').children().addClass('form-control').controller('ngModel');
      });
    }
  });
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    name: '',
    index: '',

    init: function($scope, $element, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      this.template = tmp.find('template').html();

      this.$parent.cols.push(this);
    }
  });
};
},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style:
      //hand + unselectable
      'nw-grid thead th{cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}' +
      'nw-grid[ng-model] tbody tr{cursor: pointer}' +

      //bootstrap bug? striped + hover + active
      'nw-grid tr.active td{background: #68c !important; color: #fff !important}',

    template:
      '<table class="table table-striped table-hover table-bordered">' +
      '  <thead>' +
      '    <tr>' +
      '    <th' +
      '      ng-repeat=" col in cols " ' +
      '      ng-class=" {active: col == sortCol} " ' +
      '      ng-click=" $parent.reverse = ((col == sortCol) && !reverse); $parent.sortCol = col " ' +
      '    > ' +
      '      {{ col.name }} ' +
      '      <i ng-show=" col == sortCol " class="fa fa-caret-{{ reverse ?\'down\' :\'up\' }} pull-right"></i> ' +
      '    </th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody>' +
      '    <tr><td>Value</td></tr>' +
      '  </tbody>' +
      '</table>',

    items: [],
    cols: [],
    sortCol: null,
    reverse: false,

    init: function($scope, $element, $timeout, $compile, $transclude){
      var
        tbody = $element.find('tbody'),
        tr = tbody.find('tr'),
        trHtml = ''
      ;

      //do not share
      $scope.cols = [];

      //init cols
      $transclude(this, function(){});

      //grid-col names not resolved yet (TODO: invoke ctrl after binding setup?)
      $timeout(function(){
        $scope.sortCol = $scope.sortCol || $scope.cols[0];

        //init repeater
        tr.attr('ng-repeat', ' it in items ');

        $scope.cols.forEach(function(col){
          trHtml += '<td>' + (col.template || ('{{ it["' + col.index + '"] }}')) + '</td>';
        });

        $compile(tr.html(trHtml))($scope);
      });

    }
  });
};
},{}],6:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items " class="{{listClass}}">' +
      '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
      '    <a href="javascript:void(0)" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>',

    items: [],
    emptyText: '',
    listClass: 'list-unstyled',
    activeClass: 'active',

    autoselect: false,

    init: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //TODO: mixin? dependent on ng-options?
      if (this.autoselect){
        this.$watch('items', this.autoselectFirst.bind(this));
      }
    },

    autoselectFirst: function(){
      return this.ngModel && ( ! this.ngModel.$modelValue ) && this.ngModel.$setViewValue(this.items[ Object.keys(this.items)[0] ]);
    }
  });
};
},{}],7:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" ng-show=" heading ">{{ heading }}</div>' +
      '  <div class="panel-body">' +
      '    <content></content>' +
      '  </div>' +
      '</div>',

    heading: ''
  });
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvY29udGVudC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1maWVsZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1ncmlkLWNvbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1ncmlkLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LWxpc3QuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctcGFuZWwuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctdGFiLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXRhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cbmFuZ3VsYXJcbiAgLm1vZHVsZSgnbmdXaWRnZXRzJywgW10pXG5cbiAgLnZhbHVlKCduZ1dpZGdldCcsIGZ1bmN0aW9uKHByb3RvKXtcbiAgICBpZiAocHJvdG8uc3R5bGUpe1xuICAgICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmhlYWQpLmFwcGVuZCgnPHN0eWxlPicgKyBwcm90by5zdHlsZSArICc8L3N0eWxlPicpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB7fSxcbiAgICAgIHByaW9yaXR5OiAtMSxcbiAgICAgIHRlbXBsYXRlOiBwcm90by50ZW1wbGF0ZSB8fCAnJyxcblxuICAgICAgLy9hdXRvbWF0aWMgc2NvcGUgPC0+IGF0dHJpYnV0ZSBiaW5kaW5nXG4gICAgICAvL21lYW50IHRvIGJlIGFuIGFsdGVybmF0aXZlIHRvIGFuZ3VsYXJqcyBkaXJlY3RpdmUgZGVmaW5pdGlvbiBvYmplY3RcbiAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRpbmplY3Rvcil7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwgcHJvdG8pO1xuXG4gICAgICAgIC8vVE9ETzogaW5jbHVkZSBwcm90b3R5cGUgY2hhaW5cbiAgICAgICAgT2JqZWN0LmtleXMocHJvdG8pLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgLy9wcmVzZXJ2ZSBkZWZhdWx0c1xuICAgICAgICAgIGlmICgkYXR0cnNba10gPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy90d28td2F5IGJvdW5kIGJlY2F1c2Ugb2Ygb2JqZWN0IHJlZmVyZW5jZXNcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc09iamVjdChwcm90b1trXSkpe1xuXG4gICAgICAgICAgICAvL3NwZWNpYWwgY2FzZSBhcnJheS1saWtlXG4gICAgICAgICAgICBpZiAoJ2xlbmd0aCcgaW4gcHJvdG9ba10pe1xuICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJyRwYXJlbnQuJyArICRhdHRyc1trXSwgZnVuY3Rpb24oY29sbCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlW2tdID0gY29sbDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuJHdhdGNoKCckcGFyZW50LicgKyAkYXR0cnNba10sIGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICRzY29wZVtrXSA9IHZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vb25lLXdheSBib29sZWFuXG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm90b1trXSA9PT0gJ2Jvb2xlYW4nKXtcblxuICAgICAgICAgICAgLy9zdGF0aWMgYmluYXJ5IGF0dHJpYnV0ZSAoYXV0b2ZvY3VzLCBldGMuKVxuICAgICAgICAgICAgaWYgKCRhdHRyc1trXSA9PT0gJycpe1xuICAgICAgICAgICAgICAkc2NvcGVba10gPSBrO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZXhwcmVzc2lvbiBvdGhlcndpc2VcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuJHdhdGNoKCckcGFyZW50LicgKyAkYXR0cnNba10sIGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICRzY29wZVtrXSA9ICghISB2YWwpICYmIGs7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL29uZS13YXkgbnVtYmVyXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNOdW1iZXIocHJvdG9ba10pKXtcbiAgICAgICAgICAgIHJldHVybiAkYXR0cnMuJG9ic2VydmUoaywgZnVuY3Rpb24odmFsKXtcbiAgICAgICAgICAgICAgJHNjb3BlW2tdID0gK3ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vb25lLXdheVxuICAgICAgICAgICRhdHRycy4kb2JzZXJ2ZShrLCBmdW5jdGlvbih2YWwpe1xuICAgICAgICAgICAgJHNjb3BlW2tdID0gdmFsO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoJHNjb3BlLmluaXQpe1xuICAgICAgICAgICRpbmplY3Rvci5pbnZva2UoJHNjb3BlLmluaXQsICRzY29wZSwgeyRlbGVtZW50OiAkZWxlbWVudCwgJGF0dHJzOiAkYXR0cnMsICRzY29wZTogJHNjb3BlLCAkdHJhbnNjbHVkZTogJHRyYW5zY2x1ZGV9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pXG5cbiAgLmRpcmVjdGl2ZSgnY29udGVudCcsIHJlcXVpcmUoJy4vc3JjL2NvbnRlbnQnKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXN0JywgcmVxdWlyZSgnLi9zcmMvbnctbGlzdCcpKVxuICAuZGlyZWN0aXZlKCdud0ZpZWxkJywgcmVxdWlyZSgnLi9zcmMvbnctZmllbGQnKSlcbiAgLmRpcmVjdGl2ZSgnbndQYW5lbCcsIHJlcXVpcmUoJy4vc3JjL253LXBhbmVsJykpXG5cbiAgLmRpcmVjdGl2ZSgnbndHcmlkJywgcmVxdWlyZSgnLi9zcmMvbnctZ3JpZCcpKVxuICAuZGlyZWN0aXZlKCdud0dyaWRDb2wnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkLWNvbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253VGFicycsIHJlcXVpcmUoJy4vc3JjL253LXRhYnMnKSlcbiAgLmRpcmVjdGl2ZSgnbndUYWInLCByZXF1aXJlKCcuL3NyYy9udy10YWInKSlcbjsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICR0cmFuc2NsdWRlKXtcbiAgICAgICR0cmFuc2NsdWRlKCRzY29wZS4kcGFyZW50LCAkZWxlbWVudC5hcHBlbmQuYmluZCgkZWxlbWVudCkpO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwiIHtcXCdoYXMtZXJyb3JcXCc6IG5nTW9kZWwuJGRpcnR5ICYmIG5nTW9kZWwuJGludmFsaWR9IFwiPicgK1xuICAgICAgJyAgPGxhYmVsIG5nLXNob3c9XCIgbGFiZWwgXCIgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+e3sgbGFiZWwgfX08L2xhYmVsPicgK1xuICAgICAgJyAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuXG4gICAgICAnICA8cCBjbGFzcz1cImhlbHAtYmxvY2tcIj4nICtcbiAgICAgICcgICAge3sgaGVscCB9fScgK1xuICAgICAgJyAgPC9wPicgK1xuXG4gICAgICAnICA8dWwgY2xhc3M9XCJoZWxwLWJsb2NrXCIgbmctc2hvdz1cIiBuZ01vZGVsLiRkaXJ0eSBcIiBzdHlsZT1cIiBmb250LXdlaWdodDogYm9sZCBcIj4nICtcbiAgICAgICcgICAgPGxpIG5nLXJlcGVhdD1cIiAoaywgZSkgaW4gbmdNb2RlbC4kZXJyb3IgXCIgbmctc2hvdz1cIiBlIFwiPlRoaXMgZmllbGQgaXMge3sgayB9fTwvbGk+JyArXG4gICAgICAnICA8L3VsPicgK1xuICAgICAgJzwvZGl2PicsXG5cbiAgICBsYWJlbDogJycsXG4gICAgaGVscDogJycsXG5cbiAgICBpbml0OiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkdGltZW91dCl7XG4gICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubmdNb2RlbCA9ICRlbGVtZW50LmZpbmQoJ2NvbnRlbnQnKS5jaGlsZHJlbigpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wnKS5jb250cm9sbGVyKCduZ01vZGVsJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIG5hbWU6ICcnLFxuICAgIGluZGV4OiAnJyxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICR0cmFuc2NsdWRlKXtcbiAgICAgIC8vY29weSBjb250ZW50cyAoVE9ETzogJGhvc3QpXG4gICAgICB2YXIgdG1wID0gJGVsZW1lbnQuY2xvbmUoKS5odG1sKCcnKTtcbiAgICAgICR0cmFuc2NsdWRlKHRoaXMsIHRtcC5hcHBlbmQuYmluZCh0bXApKTtcblxuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRtcC5maW5kKCd0ZW1wbGF0ZScpLmh0bWwoKTtcblxuICAgICAgdGhpcy4kcGFyZW50LmNvbHMucHVzaCh0aGlzKTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9ib290c3RyYXAgYnVnPyBzdHJpcGVkICsgaG92ZXIgKyBhY3RpdmVcbiAgICAgICdudy1ncmlkIHRyLmFjdGl2ZSB0ZHtiYWNrZ3JvdW5kOiAjNjhjICFpbXBvcnRhbnQ7IGNvbG9yOiAjZmZmICFpbXBvcnRhbnR9JyxcblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtaG92ZXIgdGFibGUtYm9yZGVyZWRcIj4nICtcbiAgICAgICcgIDx0aGVhZD4nICtcbiAgICAgICcgICAgPHRyPicgK1xuICAgICAgJyAgICA8dGgnICtcbiAgICAgICcgICAgICBuZy1yZXBlYXQ9XCIgY29sIGluIGNvbHMgXCIgJyArXG4gICAgICAnICAgICAgbmctY2xhc3M9XCIge2FjdGl2ZTogY29sID09IHNvcnRDb2x9IFwiICcgK1xuICAgICAgJyAgICAgIG5nLWNsaWNrPVwiICRwYXJlbnQucmV2ZXJzZSA9ICgoY29sID09IHNvcnRDb2wpICYmICFyZXZlcnNlKTsgJHBhcmVudC5zb3J0Q29sID0gY29sIFwiICcgK1xuICAgICAgJyAgICA+ICcgK1xuICAgICAgJyAgICAgIHt7IGNvbC5uYW1lIH19ICcgK1xuICAgICAgJyAgICAgIDxpIG5nLXNob3c9XCIgY29sID09IHNvcnRDb2wgXCIgY2xhc3M9XCJmYSBmYS1jYXJldC17eyByZXZlcnNlID9cXCdkb3duXFwnIDpcXCd1cFxcJyB9fSBwdWxsLXJpZ2h0XCI+PC9pPiAnICtcbiAgICAgICcgICAgPC90aD4nICtcbiAgICAgICcgICAgPC90cj4nICtcbiAgICAgICcgIDwvdGhlYWQ+JyArXG4gICAgICAnICA8dGJvZHk+JyArXG4gICAgICAnICAgIDx0cj48dGQ+VmFsdWU8L3RkPjwvdHI+JyArXG4gICAgICAnICA8L3Rib2R5PicgK1xuICAgICAgJzwvdGFibGU+JyxcblxuICAgIGl0ZW1zOiBbXSxcbiAgICBjb2xzOiBbXSxcbiAgICBzb3J0Q29sOiBudWxsLFxuICAgIHJldmVyc2U6IGZhbHNlLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRjb21waWxlLCAkdHJhbnNjbHVkZSl7XG4gICAgICB2YXJcbiAgICAgICAgdGJvZHkgPSAkZWxlbWVudC5maW5kKCd0Ym9keScpLFxuICAgICAgICB0ciA9IHRib2R5LmZpbmQoJ3RyJyksXG4gICAgICAgIHRySHRtbCA9ICcnXG4gICAgICA7XG5cbiAgICAgIC8vZG8gbm90IHNoYXJlXG4gICAgICAkc2NvcGUuY29scyA9IFtdO1xuXG4gICAgICAvL2luaXQgY29sc1xuICAgICAgJHRyYW5zY2x1ZGUodGhpcywgZnVuY3Rpb24oKXt9KTtcblxuICAgICAgLy9ncmlkLWNvbCBuYW1lcyBub3QgcmVzb2x2ZWQgeWV0IChUT0RPOiBpbnZva2UgY3RybCBhZnRlciBiaW5kaW5nIHNldHVwPylcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zb3J0Q29sID0gJHNjb3BlLnNvcnRDb2wgfHwgJHNjb3BlLmNvbHNbMF07XG5cbiAgICAgICAgLy9pbml0IHJlcGVhdGVyXG4gICAgICAgIHRyLmF0dHIoJ25nLXJlcGVhdCcsICcgaXQgaW4gaXRlbXMgJyk7XG5cbiAgICAgICAgJHNjb3BlLmNvbHMuZm9yRWFjaChmdW5jdGlvbihjb2wpe1xuICAgICAgICAgIHRySHRtbCArPSAnPHRkPicgKyAoY29sLnRlbXBsYXRlIHx8ICgne3sgaXRbXCInICsgY29sLmluZGV4ICsgJ1wiXSB9fScpKSArICc8L3RkPic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRjb21waWxlKHRyLmh0bWwodHJIdG1sKSkoJHNjb3BlKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8dWwgbmctc2hvdz1cIiBpdGVtcyBcIiBjbGFzcz1cInt7bGlzdENsYXNzfX1cIj4nICtcbiAgICAgICcgIDxsaSBuZy1yZXBlYXQ9XCIgaXQgaW4gaXRlbXMgXCIgbmctY2xhc3M9XCIgeyB7e2FjdGl2ZUNsYXNzfX06IG5nTW9kZWwuJG1vZGVsVmFsdWUgPT0gaXR9IFwiPicgK1xuICAgICAgJyAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgbmctY2xpY2s9XCIgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGl0KSBcIj57eyBpdC5uYW1lIH19PC9hPicgK1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicsXG5cbiAgICBpdGVtczogW10sXG4gICAgZW1wdHlUZXh0OiAnJyxcbiAgICBsaXN0Q2xhc3M6ICdsaXN0LXVuc3R5bGVkJyxcbiAgICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG5cbiAgICBhdXRvc2VsZWN0OiBmYWxzZSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgJHNjb3BlLm5nTW9kZWwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIC8vVE9ETzogbWl4aW4/IGRlcGVuZGVudCBvbiBuZy1vcHRpb25zP1xuICAgICAgaWYgKHRoaXMuYXV0b3NlbGVjdCl7XG4gICAgICAgIHRoaXMuJHdhdGNoKCdpdGVtcycsIHRoaXMuYXV0b3NlbGVjdEZpcnN0LmJpbmQodGhpcykpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBhdXRvc2VsZWN0Rmlyc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5uZ01vZGVsICYmICggISB0aGlzLm5nTW9kZWwuJG1vZGVsVmFsdWUgKSAmJiB0aGlzLm5nTW9kZWwuJHNldFZpZXdWYWx1ZSh0aGlzLml0ZW1zWyBPYmplY3Qua2V5cyh0aGlzLml0ZW1zKVswXSBdKTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIG5nLXNob3c9XCIgaGVhZGluZyBcIj57eyBoZWFkaW5nIH19PC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPicgK1xuICAgICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnICA8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nLFxuXG4gICAgaGVhZGluZzogJydcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8Y29udGVudCBuZy1zaG93PVwiIHBhcmVudFRhYnNTY29wZS5hY3RpdmVUYWIgPT0gdGhpcyBcIj48L2NvbnRlbnQ+JyxcblxuICAgIG5hbWU6ICcnLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oJGVsZW1lbnQpe1xuICAgICAgdGhpcy5wYXJlbnRUYWJzU2NvcGUgPSAkZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5pc29sYXRlU2NvcGUoKTtcbiAgICAgIHRoaXMucGFyZW50VGFic1Njb3BlLnRhYnMucHVzaCh0aGlzKTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOiAnbnctdGFicyBudy1saXN0e2Rpc3BsYXk6IGJsb2NrOyBtYXJnaW4tYm90dG9tOiAxZW19JyxcblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzxudy1saXN0IGl0ZW1zPVwiIHRhYnMgXCIgbGlzdC1jbGFzcz1cIm5hdiBuYXYtdGFic1wiIG5nLW1vZGVsPVwiYWN0aXZlVGFiXCIgYXV0b3NlbGVjdD48L253LWxpc3Q+JyArXG4gICAgICAnPGNvbnRlbnQ+PC9jb250ZW50PicsXG5cbiAgICB0YWJzOiBbXSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAvL2RvIG5vdCBzaGFyZVxuICAgICAgdGhpcy50YWJzID0gW107XG4gICAgfVxuICB9KTtcbn07Il19
