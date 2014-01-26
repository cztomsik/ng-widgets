(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ngWidgets', [])
;

module.exports = ngWidgets;

angular.element.prototype.find = require('./src/qsa.js');

ngWidgets
  .value('ngWidget', require('./src/ngWidget.js'))

  .directive('content', require('./src/content'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwField', require('./src/nw-field'))
  .directive('nwRow', require('./src/nw-row'))
  .directive('nwPanel', require('./src/nw-panel'))
  .directive('nwModal', require('./src/nw-modal'))

  .directive('nwLipsum', require('./src/nw-lipsum'))

  .directive('nwGrid', require('./src/nw-grid'))
  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
  .directive('nwTab', require('./src/nw-tab'))
;
},{"./src/content":3,"./src/ngWidget.js":4,"./src/nw-field":5,"./src/nw-grid":7,"./src/nw-grid-col":6,"./src/nw-lipsum":8,"./src/nw-list":9,"./src/nw-modal":10,"./src/nw-panel":11,"./src/nw-row":12,"./src/nw-tab":13,"./src/nw-tabs":14,"./src/qsa.js":15,"angular":2}],2:[function(require,module,exports){
module.exports = window.angular;
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    link: function($scope, $element, $attrs, ctrls, $transclude){
      $transclude($scope.$parent, $element.append.bind($element));
    }
  };
};
},{}],4:[function(require,module,exports){
'use strict';

var
  angular = require('angular')
;

module.exports = function(widgetDef){
  return angular.extend({}, {
    //defaults
    restrict: 'E',
    template: '',
    transclude: true,
    scope: {},

    //actual stuff
    compile: function(){
      return {
        pre: this.prelink.bind(this),
        post: this.link && this.link.bind(this)
      };
    },

    prelink: function($scope, $element, $attrs){
      for (var k in $attrs.$attr){
        $scope[k] = $attrs[k];

        if ($attrs.$$observers && $attrs.$$observers[k]){
          $attrs.$observe(k, dotSet($scope, k));
        }
      }
    }
  }, widgetDef);
};

function dotSet(obj, prop){
  return function(val){
    obj[prop] = val;
  };
}
},{"angular":2}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
      '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
      '  <content></content>' +
      '</div>',

    link: function($scope, $element){
      var control = $element.find('textarea, select, input:not([type="radio"]):not([type="checkbox"])');

      $scope.ngModel = control.controller('ngModel');

      control.addClass('form-control');
    }
  });
};
},{}],6:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      }
    },

    link: function($scope, $element, $attrs, ctrls, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      $scope.html = tmp.find('template').html();
    }
  });
};
},{}],7:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(ngWidget){
  return ngWidget({
    style:
      //hand + unselectable
      'nw-grid thead th{cursor: pointer; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none}' +
      'nw-grid[ng-model] tbody tr{cursor: pointer}' +

      //carret visibility
      'nw-grid th i.fa{visibility: hidden}' +
      'nw-grid th.active i.fa{visibility: visible}' +

      //bootstrap bug? striped + hover + active
      'nw-grid tr.active td{background: #68c !important; color: #fff !important}',

    template:
      //transclude columns (TODO: make ngWidget() automatically transclude everything)
      '<content></content>' +

      '<table class="table table-striped table-hover table-bordered">' +
      '  <thead>' +
      '    <tr>' +
      '    <th' +
      '      ng-repeat=" col in cols " ' +
      '      ng-class=" {active: col == sortCol} " ' +
      '      ng-click=" $parent.reverse = ((col == sortCol) && !reverse); $parent.sortCol = col " ' +
      '    >' +
      '      {{ col.name }} ' +
      '      <i class="fa fa-caret-{{ reverse ?\'down\' :\'up\' }} pull-right"></i>' +
      '    </th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody>' +
      '    <tr><td>Value</td></tr>' +
      '  </tbody>' +
      '</table>',

    controller: function($scope){
      $scope.cols = [];
      $scope.autosort = true;

      $scope.$watch('cols', function(){
        if ($scope.autosort){
          $scope.sortCol = $scope.cols[0];
        }
      });
    },

    link: function($scope, $element){
      //initialize using elements
      var
        colEls = $element.find('nw-grid-col'),
        tr = $element.find('tbody tr'),
        trHtml = ''
      ;

      //TODO: this should be in controller, but its too early (attributes are not bound)
      //  [] support might solve this
      $scope.$parent.$watchCollection($scope.items, function(itemsColl){
        $scope.itemsColl = itemsColl || [];
      });

      //TODO: this is nasty, would be much better to get all hostElement scopes in array
      angular.forEach(colEls, function(colEl){
        $scope.cols.push(angular.element(colEl).isolateScope());
      });

      //init repeater
      tr.attr('ng-repeat', ' it in itemsColl | orderBy:sortCol.index:reverse ');

      $scope.cols.forEach(function(col){
        trHtml += '<td>' + col.template() + '</td>';
      });

      //TODO: find better way to compile new elements in link phase
      $element.injector().get('$compile')(tr.html(trHtml))($scope);
    }
  });
};
},{"angular":2}],8:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  var
    definition = ngWidget({
      lipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

      template: '<p>{{ lipsum }}</p>',
      controller: function($scope){
        $scope.lipsum = definition.lipsum;
      }
    }
  );

  return definition;
};
},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" itemsColl " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in itemsColl " ng-class="{ {{ activeClass }}: it == ngModel.$modelValue }">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" itemsColl ">{{ emptyText }}</p>',

    controller: function($scope){
      $scope.emptyText = 'No items found';
      $scope.activeClass = 'active';
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      $scope.$parent.$watchCollection($scope.items, function(itemsColl){
        $scope.itemsColl = itemsColl || [];
      });

      //if ('autoselect' in $scope){
      //
      //}
    }
  });
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-modal .modal{display: block}',

    //optional full-height styles
    //TODO: consider introducing new element
    //TODO: consider relation to overlay
    //
    // nw-modal .modal-content{border-radius: 0; border: 0; height: 100%}
    // nw-modal .modal-dialog{position: fixed; width: 100%; height: 100%; margin: 0; top: 0; left: 0}

    template:
      '<div class="modal" role="dialog"><div class="modal-dialog"><div class="modal-content">' +
      '  <div class="modal-header" ng-show=" name "><h3 class="modal-title">{{ name }}</h3></div>' +
      '  <div class="modal-body">' +
      '    <content></content>' +
      '  </div>' +
      '  <div class="modal-footer" ng-show=" footer ">{{ footer }}</div>' +
      '</div></div></div>'
  });
};
},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" ng-show=" name ">{{ name }}</div>' +
      '  <div class="panel-body">' +
      '    <content></content>' +
      '  </div>' +
      '</div>'
  });
};
},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>',
    link: function($scope, $element, $attrs){
      $element.find('.row > content').children().addClass($attrs.itemClass);
    }
  });
};
},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>'
  });
};
},{}],14:[function(require,module,exports){
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
},{"angular":2}],15:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(selector){
  var res = [];

  [].forEach.call(this, function(el){
    res.push.apply(res, el.querySelectorAll(selector));
  });

  return angular.element(res);
};
},{"angular":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zaGltcy9hbmd1bGFyLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC1jb2wuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXBzdW0uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctbGlzdC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1tb2RhbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1wYW5lbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1yb3cuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctdGFiLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXRhYnMuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvcXNhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICBuZ1dpZGdldHMgPSBhbmd1bGFyLm1vZHVsZSgnbmdXaWRnZXRzJywgW10pXG47XG5cbm1vZHVsZS5leHBvcnRzID0gbmdXaWRnZXRzO1xuXG5hbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlLmZpbmQgPSByZXF1aXJlKCcuL3NyYy9xc2EuanMnKTtcblxubmdXaWRnZXRzXG4gIC52YWx1ZSgnbmdXaWRnZXQnLCByZXF1aXJlKCcuL3NyYy9uZ1dpZGdldC5qcycpKVxuXG4gIC5kaXJlY3RpdmUoJ2NvbnRlbnQnLCByZXF1aXJlKCcuL3NyYy9jb250ZW50JykpXG4gIC5kaXJlY3RpdmUoJ253TGlzdCcsIHJlcXVpcmUoJy4vc3JjL253LWxpc3QnKSlcbiAgLmRpcmVjdGl2ZSgnbndGaWVsZCcsIHJlcXVpcmUoJy4vc3JjL253LWZpZWxkJykpXG4gIC5kaXJlY3RpdmUoJ253Um93JywgcmVxdWlyZSgnLi9zcmMvbnctcm93JykpXG4gIC5kaXJlY3RpdmUoJ253UGFuZWwnLCByZXF1aXJlKCcuL3NyYy9udy1wYW5lbCcpKVxuICAuZGlyZWN0aXZlKCdud01vZGFsJywgcmVxdWlyZSgnLi9zcmMvbnctbW9kYWwnKSlcblxuICAuZGlyZWN0aXZlKCdud0xpcHN1bScsIHJlcXVpcmUoJy4vc3JjL253LWxpcHN1bScpKVxuXG4gIC5kaXJlY3RpdmUoJ253R3JpZCcsIHJlcXVpcmUoJy4vc3JjL253LWdyaWQnKSlcbiAgLmRpcmVjdGl2ZSgnbndHcmlkQ29sJywgcmVxdWlyZSgnLi9zcmMvbnctZ3JpZC1jb2wnKSlcblxuICAuZGlyZWN0aXZlKCdud1RhYnMnLCByZXF1aXJlKCcuL3NyYy9udy10YWJzJykpXG4gIC5kaXJlY3RpdmUoJ253VGFiJywgcmVxdWlyZSgnLi9zcmMvbnctdGFiJykpXG47IiwibW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuYW5ndWxhcjsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgY3RybHMsICR0cmFuc2NsdWRlKXtcbiAgICAgICR0cmFuc2NsdWRlKCRzY29wZS4kcGFyZW50LCAkZWxlbWVudC5hcHBlbmQuYmluZCgkZWxlbWVudCkpO1xuICAgIH1cbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZGdldERlZil7XG4gIHJldHVybiBhbmd1bGFyLmV4dGVuZCh7fSwge1xuICAgIC8vZGVmYXVsdHNcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAnJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHNjb3BlOiB7fSxcblxuICAgIC8vYWN0dWFsIHN0dWZmXG4gICAgY29tcGlsZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByZTogdGhpcy5wcmVsaW5rLmJpbmQodGhpcyksXG4gICAgICAgIHBvc3Q6IHRoaXMubGluayAmJiB0aGlzLmxpbmsuYmluZCh0aGlzKVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgcHJlbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKXtcbiAgICAgIGZvciAodmFyIGsgaW4gJGF0dHJzLiRhdHRyKXtcbiAgICAgICAgJHNjb3BlW2tdID0gJGF0dHJzW2tdO1xuXG4gICAgICAgIGlmICgkYXR0cnMuJCRvYnNlcnZlcnMgJiYgJGF0dHJzLiQkb2JzZXJ2ZXJzW2tdKXtcbiAgICAgICAgICAkYXR0cnMuJG9ic2VydmUoaywgZG90U2V0KCRzY29wZSwgaykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB3aWRnZXREZWYpO1xufTtcblxuZnVuY3Rpb24gZG90U2V0KG9iaiwgcHJvcCl7XG4gIHJldHVybiBmdW5jdGlvbih2YWwpe1xuICAgIG9ialtwcm9wXSA9IHZhbDtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgICAnICA8bGFiZWwgbmctc2hvdz1cIiBsYWJlbCBcIiBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj57eyBsYWJlbCB9fTwvbGFiZWw+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIGNvbnRyb2wgPSAkZWxlbWVudC5maW5kKCd0ZXh0YXJlYSwgc2VsZWN0LCBpbnB1dDpub3QoW3R5cGU9XCJyYWRpb1wiXSk6bm90KFt0eXBlPVwiY2hlY2tib3hcIl0pJyk7XG5cbiAgICAgICRzY29wZS5uZ01vZGVsID0gY29udHJvbC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIGNvbnRyb2wuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS50ZW1wbGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmh0bWwgfHwgKCd7eyBpdFtcIicgKyB0aGlzLmluZGV4ICsgJ1wiXSB9fScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIGN0cmxzLCAkdHJhbnNjbHVkZSl7XG4gICAgICAvL2NvcHkgY29udGVudHMgKFRPRE86ICRob3N0KVxuICAgICAgdmFyIHRtcCA9ICRlbGVtZW50LmNsb25lKCkuaHRtbCgnJyk7XG4gICAgICAkdHJhbnNjbHVkZSh0aGlzLCB0bXAuYXBwZW5kLmJpbmQodG1wKSk7XG5cbiAgICAgICRzY29wZS5odG1sID0gdG1wLmZpbmQoJ3RlbXBsYXRlJykuaHRtbCgpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9jYXJyZXQgdmlzaWJpbGl0eVxuICAgICAgJ253LWdyaWQgdGggaS5mYXt2aXNpYmlsaXR5OiBoaWRkZW59JyArXG4gICAgICAnbnctZ3JpZCB0aC5hY3RpdmUgaS5mYXt2aXNpYmlsaXR5OiB2aXNpYmxlfScgK1xuXG4gICAgICAvL2Jvb3RzdHJhcCBidWc/IHN0cmlwZWQgKyBob3ZlciArIGFjdGl2ZVxuICAgICAgJ253LWdyaWQgdHIuYWN0aXZlIHRke2JhY2tncm91bmQ6ICM2OGMgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudH0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAvL3RyYW5zY2x1ZGUgY29sdW1ucyAoVE9ETzogbWFrZSBuZ1dpZGdldCgpIGF1dG9tYXRpY2FsbHkgdHJhbnNjbHVkZSBldmVyeXRoaW5nKVxuICAgICAgJzxjb250ZW50PjwvY29udGVudD4nICtcblxuICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtaG92ZXIgdGFibGUtYm9yZGVyZWRcIj4nICtcbiAgICAgICcgIDx0aGVhZD4nICtcbiAgICAgICcgICAgPHRyPicgK1xuICAgICAgJyAgICA8dGgnICtcbiAgICAgICcgICAgICBuZy1yZXBlYXQ9XCIgY29sIGluIGNvbHMgXCIgJyArXG4gICAgICAnICAgICAgbmctY2xhc3M9XCIge2FjdGl2ZTogY29sID09IHNvcnRDb2x9IFwiICcgK1xuICAgICAgJyAgICAgIG5nLWNsaWNrPVwiICRwYXJlbnQucmV2ZXJzZSA9ICgoY29sID09IHNvcnRDb2wpICYmICFyZXZlcnNlKTsgJHBhcmVudC5zb3J0Q29sID0gY29sIFwiICcgK1xuICAgICAgJyAgICA+JyArXG4gICAgICAnICAgICAge3sgY29sLm5hbWUgfX0gJyArXG4gICAgICAnICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jYXJldC17eyByZXZlcnNlID9cXCdkb3duXFwnIDpcXCd1cFxcJyB9fSBwdWxsLXJpZ2h0XCI+PC9pPicgK1xuICAgICAgJyAgICA8L3RoPicgK1xuICAgICAgJyAgICA8L3RyPicgK1xuICAgICAgJyAgPC90aGVhZD4nICtcbiAgICAgICcgIDx0Ym9keT4nICtcbiAgICAgICcgICAgPHRyPjx0ZD5WYWx1ZTwvdGQ+PC90cj4nICtcbiAgICAgICcgIDwvdGJvZHk+JyArXG4gICAgICAnPC90YWJsZT4nLFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS5jb2xzID0gW107XG4gICAgICAkc2NvcGUuYXV0b3NvcnQgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdjb2xzJywgZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCRzY29wZS5hdXRvc29ydCl7XG4gICAgICAgICAgJHNjb3BlLnNvcnRDb2wgPSAkc2NvcGUuY29sc1swXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgLy9pbml0aWFsaXplIHVzaW5nIGVsZW1lbnRzXG4gICAgICB2YXJcbiAgICAgICAgY29sRWxzID0gJGVsZW1lbnQuZmluZCgnbnctZ3JpZC1jb2wnKSxcbiAgICAgICAgdHIgPSAkZWxlbWVudC5maW5kKCd0Ym9keSB0cicpLFxuICAgICAgICB0ckh0bWwgPSAnJ1xuICAgICAgO1xuXG4gICAgICAvL1RPRE86IHRoaXMgc2hvdWxkIGJlIGluIGNvbnRyb2xsZXIsIGJ1dCBpdHMgdG9vIGVhcmx5IChhdHRyaWJ1dGVzIGFyZSBub3QgYm91bmQpXG4gICAgICAvLyAgW10gc3VwcG9ydCBtaWdodCBzb2x2ZSB0aGlzXG4gICAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKCRzY29wZS5pdGVtcywgZnVuY3Rpb24oaXRlbXNDb2xsKXtcbiAgICAgICAgJHNjb3BlLml0ZW1zQ29sbCA9IGl0ZW1zQ29sbCB8fCBbXTtcbiAgICAgIH0pO1xuXG4gICAgICAvL1RPRE86IHRoaXMgaXMgbmFzdHksIHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGdldCBhbGwgaG9zdEVsZW1lbnQgc2NvcGVzIGluIGFycmF5XG4gICAgICBhbmd1bGFyLmZvckVhY2goY29sRWxzLCBmdW5jdGlvbihjb2xFbCl7XG4gICAgICAgICRzY29wZS5jb2xzLnB1c2goYW5ndWxhci5lbGVtZW50KGNvbEVsKS5pc29sYXRlU2NvcGUoKSk7XG4gICAgICB9KTtcblxuICAgICAgLy9pbml0IHJlcGVhdGVyXG4gICAgICB0ci5hdHRyKCduZy1yZXBlYXQnLCAnIGl0IGluIGl0ZW1zQ29sbCB8IG9yZGVyQnk6c29ydENvbC5pbmRleDpyZXZlcnNlICcpO1xuXG4gICAgICAkc2NvcGUuY29scy5mb3JFYWNoKGZ1bmN0aW9uKGNvbCl7XG4gICAgICAgIHRySHRtbCArPSAnPHRkPicgKyBjb2wudGVtcGxhdGUoKSArICc8L3RkPic7XG4gICAgICB9KTtcblxuICAgICAgLy9UT0RPOiBmaW5kIGJldHRlciB3YXkgdG8gY29tcGlsZSBuZXcgZWxlbWVudHMgaW4gbGluayBwaGFzZVxuICAgICAgJGVsZW1lbnQuaW5qZWN0b3IoKS5nZXQoJyRjb21waWxlJykodHIuaHRtbCh0ckh0bWwpKSgkc2NvcGUpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHZhclxuICAgIGRlZmluaXRpb24gPSBuZ1dpZGdldCh7XG4gICAgICBsaXBzdW06ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLicsXG5cbiAgICAgIHRlbXBsYXRlOiAnPHA+e3sgbGlwc3VtIH19PC9wPicsXG4gICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgICAkc2NvcGUubGlwc3VtID0gZGVmaW5pdGlvbi5saXBzdW07XG4gICAgICB9XG4gICAgfVxuICApO1xuXG4gIHJldHVybiBkZWZpbml0aW9uO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzx1bCBuZy1zaG93PVwiIGl0ZW1zQ29sbCBcIiBjbGFzcz1cInt7IGxpc3RDbGFzcyB9fVwiPicgK1xuICAgICAgJyAgPGxpIG5nLXJlcGVhdD1cIiBpdCBpbiBpdGVtc0NvbGwgXCIgbmctY2xhc3M9XCJ7IHt7IGFjdGl2ZUNsYXNzIH19OiBpdCA9PSBuZ01vZGVsLiRtb2RlbFZhbHVlIH1cIj4nICtcbiAgICAgICcgICAgPGEgaHJlZj1cIlwiIG5nLWNsaWNrPVwiIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShpdCkgXCI+e3sgaXQubmFtZSB9fTwvYT4nICtcbiAgICAgICcgIDwvbGk+JyArXG4gICAgICAnPC91bD4nICtcbiAgICAgICc8cCBuZy1oaWRlPVwiIGl0ZW1zQ29sbCBcIj57eyBlbXB0eVRleHQgfX08L3A+JyxcblxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4gICAgICAkc2NvcGUuZW1wdHlUZXh0ID0gJ05vIGl0ZW1zIGZvdW5kJztcbiAgICAgICRzY29wZS5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KXtcbiAgICAgICRzY29wZS5uZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKCRzY29wZS5pdGVtcywgZnVuY3Rpb24oaXRlbXNDb2xsKXtcbiAgICAgICAgJHNjb3BlLml0ZW1zQ29sbCA9IGl0ZW1zQ29sbCB8fCBbXTtcbiAgICAgIH0pO1xuXG4gICAgICAvL2lmICgnYXV0b3NlbGVjdCcgaW4gJHNjb3BlKXtcbiAgICAgIC8vXG4gICAgICAvL31cbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOiAnbnctbW9kYWwgLm1vZGFse2Rpc3BsYXk6IGJsb2NrfScsXG5cbiAgICAvL29wdGlvbmFsIGZ1bGwtaGVpZ2h0IHN0eWxlc1xuICAgIC8vVE9ETzogY29uc2lkZXIgaW50cm9kdWNpbmcgbmV3IGVsZW1lbnRcbiAgICAvL1RPRE86IGNvbnNpZGVyIHJlbGF0aW9uIHRvIG92ZXJsYXlcbiAgICAvL1xuICAgIC8vIG53LW1vZGFsIC5tb2RhbC1jb250ZW50e2JvcmRlci1yYWRpdXM6IDA7IGJvcmRlcjogMDsgaGVpZ2h0OiAxMDAlfVxuICAgIC8vIG53LW1vZGFsIC5tb2RhbC1kaWFsb2d7cG9zaXRpb246IGZpeGVkOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBtYXJnaW46IDA7IHRvcDogMDsgbGVmdDogMH1cblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJtb2RhbFwiIHJvbGU9XCJkaWFsb2dcIj48ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIiBuZy1zaG93PVwiIG5hbWUgXCI+PGgzIGNsYXNzPVwibW9kYWwtdGl0bGVcIj57eyBuYW1lIH19PC9oMz48L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+JyArXG4gICAgICAnICAgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICcgIDwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiIG5nLXNob3c9XCIgZm9vdGVyIFwiPnt7IGZvb3RlciB9fTwvZGl2PicgK1xuICAgICAgJzwvZGl2PjwvZGl2PjwvZGl2PidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgbmctc2hvdz1cIiBuYW1lIFwiPnt7IG5hbWUgfX08L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+JyArXG4gICAgICAnICAgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICcgIDwvZGl2PicgK1xuICAgICAgJzwvZGl2PidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicm93XCI+PGNvbnRlbnQ+PC9jb250ZW50PjwvZGl2PicsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKXtcbiAgICAgICRlbGVtZW50LmZpbmQoJy5yb3cgPiBjb250ZW50JykuY2hpbGRyZW4oKS5hZGRDbGFzcygkYXR0cnMuaXRlbUNsYXNzKTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOiAnPGNvbnRlbnQgbmctc2hvdz1cIiBhY3RpdmUgXCI+PC9jb250ZW50PidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOiAnbnctdGFicyBudy1saXN0e2Rpc3BsYXk6IGJsb2NrOyBtYXJnaW4tYm90dG9tOiAxZW19JyxcblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzxudy1saXN0IGl0ZW1zPVwiIHRhYnMgXCIgbGlzdC1jbGFzcz1cIm5hdiBuYXYtdGFic1wiIG5nLW1vZGVsPVwiIGFjdGl2ZVRhYiBcIj48L253LWxpc3Q+JyArXG4gICAgICAnPGNvbnRlbnQ+PC9jb250ZW50PicsXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgJHNjb3BlLnRhYnMgPSBbXTtcblxuICAgICAgJHNjb3BlLiR3YXRjaCgnYWN0aXZlVGFiJywgZnVuY3Rpb24oYWN0aXZlVGFiKXtcbiAgICAgICAgJHNjb3BlLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpe1xuICAgICAgICAgIHRhYi5hY3RpdmUgPSAodGFiID09PSBhY3RpdmVUYWIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KXtcbiAgICAgIC8vaW5pdGlhbGl6ZSB1c2luZyBlbGVtZW50c1xuICAgICAgdmFyIHRhYkVscyA9ICRlbGVtZW50LmZpbmQoJ253LXRhYicpO1xuXG4gICAgICAvL1RPRE86IHRoaXMgaXMgbmFzdHksIHdvdWxkIGJlIG11Y2ggYmV0dGVyIHRvIGdldCBhbGwgaG9zdEVsZW1lbnQgc2NvcGVzIGluIGFycmF5XG4gICAgICBhbmd1bGFyLmZvckVhY2godGFiRWxzLCBmdW5jdGlvbih0YWJFbCl7XG4gICAgICAgICRzY29wZS50YWJzLnB1c2goYW5ndWxhci5lbGVtZW50KHRhYkVsKS5pc29sYXRlU2NvcGUoKSk7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLmFjdGl2ZVRhYiA9ICRzY29wZS50YWJzWzBdO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICB2YXIgcmVzID0gW107XG5cbiAgW10uZm9yRWFjaC5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVsKXtcbiAgICByZXMucHVzaC5hcHBseShyZXMsIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChyZXMpO1xufTsiXX0=
