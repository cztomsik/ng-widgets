(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ngWidgets', []),

  jQuery = global.jQuery
;

module.exports = ngWidgets;

//TODO: test
//quick and dirty
if ( ! jQuery){
  angular.element.prototype.find = require('./src/qsa.js');
}

ngWidgets
  .value('ngWidget', require('./src/ngWidget.js'))

  //TODO: test
  .filter('markdown', require('./src/markdown.js'))

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
;}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/content":4,"./src/markdown.js":5,"./src/ngWidget.js":6,"./src/nw-field":7,"./src/nw-grid":9,"./src/nw-grid-col":8,"./src/nw-lipsum":10,"./src/nw-list":11,"./src/nw-modal":12,"./src/nw-panel":13,"./src/nw-row":14,"./src/nw-tab":15,"./src/nw-tabs":16,"./src/qsa.js":17,"angular":2}],2:[function(require,module,exports){
'use strict';

module.exports = window.angular;
},{}],3:[function(require,module,exports){
'use strict';

module.exports = window.Showdown;
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    link: function($scope, $element, $attrs, ctrls, $transclude){
      $transclude($scope.$parent, $element.append.bind($element));
    }
  };
};
},{}],5:[function(require,module,exports){
'use strict';

var
  showdown = require('showdown'),
  converter = new showdown.converter()
;

module.exports = function($sce){
  return function(source){
    return source && $sce.trustAsHtml(converter.makeHtml(source));
  };
};
},{"showdown":3}],6:[function(require,module,exports){
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
},{"angular":2}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope, $element, $attrs, ctrls, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      $scope.html = tmp.find('template').html();
    }
  });
};
},{}],9:[function(require,module,exports){
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

    defaults: {
      cols: [],
      autosort: true
    },

    controller: function($scope){
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
},{"angular":2}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<p>{{ lipsum }}</p>',

    defaults: {
      lipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  });
};
},{}],11:[function(require,module,exports){
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

    defaults: {
      emptyText: 'No items found',
      activeClass: 'active'
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="panel panel-{{ type }}">' +
      '  <div class="panel-heading" ng-show=" name ">{{ name }}</div>' +
      '  <div class="panel-body">' +
      '    <content></content>' +
      '  </div>' +
      '</div>',

    defaults: {
      type: 'default'
    }
  });
};
},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>',
    link: function($scope, $element, $attrs){
      $element.find('.row > content').children().addClass($attrs.itemClass);
    }
  });
};
},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<content ng-show=" active "></content>',

    link: function($scope, $element){
      var nwTabsEl = $element.parent().parent();

      nwTabsEl.isolateScope().tabs.push($scope);
    }
  });
};
},{}],16:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model=" activeTab "></nw-list>' +
      '<content></content>',

    defaults: {
      tabs: []
    },

    controller: function($scope){
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
},{}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL2luZGV4LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc2hpbXMvYW5ndWxhci5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NoaW1zL3Nob3dkb3duLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbWFya2Rvd24uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC1jb2wuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXBzdW0uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctbGlzdC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1tb2RhbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1wYW5lbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1yb3cuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctdGFiLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXRhYnMuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvcXNhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXsndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICBuZ1dpZGdldHMgPSBhbmd1bGFyLm1vZHVsZSgnbmdXaWRnZXRzJywgW10pLFxuXG4gIGpRdWVyeSA9IGdsb2JhbC5qUXVlcnlcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZ1dpZGdldHM7XG5cbi8vVE9ETzogdGVzdFxuLy9xdWljayBhbmQgZGlydHlcbmlmICggISBqUXVlcnkpe1xuICBhbmd1bGFyLmVsZW1lbnQucHJvdG90eXBlLmZpbmQgPSByZXF1aXJlKCcuL3NyYy9xc2EuanMnKTtcbn1cblxubmdXaWRnZXRzXG4gIC52YWx1ZSgnbmdXaWRnZXQnLCByZXF1aXJlKCcuL3NyYy9uZ1dpZGdldC5qcycpKVxuXG4gIC8vVE9ETzogdGVzdFxuICAuZmlsdGVyKCdtYXJrZG93bicsIHJlcXVpcmUoJy4vc3JjL21hcmtkb3duLmpzJykpXG5cbiAgLmRpcmVjdGl2ZSgnY29udGVudCcsIHJlcXVpcmUoJy4vc3JjL2NvbnRlbnQnKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXN0JywgcmVxdWlyZSgnLi9zcmMvbnctbGlzdCcpKVxuICAuZGlyZWN0aXZlKCdud0ZpZWxkJywgcmVxdWlyZSgnLi9zcmMvbnctZmllbGQnKSlcbiAgLmRpcmVjdGl2ZSgnbndSb3cnLCByZXF1aXJlKCcuL3NyYy9udy1yb3cnKSlcbiAgLmRpcmVjdGl2ZSgnbndQYW5lbCcsIHJlcXVpcmUoJy4vc3JjL253LXBhbmVsJykpXG4gIC5kaXJlY3RpdmUoJ253TW9kYWwnLCByZXF1aXJlKCcuL3NyYy9udy1tb2RhbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253TGlwc3VtJywgcmVxdWlyZSgnLi9zcmMvbnctbGlwc3VtJykpXG5cbiAgLmRpcmVjdGl2ZSgnbndHcmlkJywgcmVxdWlyZSgnLi9zcmMvbnctZ3JpZCcpKVxuICAuZGlyZWN0aXZlKCdud0dyaWRDb2wnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkLWNvbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253VGFicycsIHJlcXVpcmUoJy4vc3JjL253LXRhYnMnKSlcbiAgLmRpcmVjdGl2ZSgnbndUYWInLCByZXF1aXJlKCcuL3NyYy9udy10YWInKSlcbjt9KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuYW5ndWxhcjsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gd2luZG93LlNob3dkb3duOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscywgJHRyYW5zY2x1ZGUpe1xuICAgICAgJHRyYW5zY2x1ZGUoJHNjb3BlLiRwYXJlbnQsICRlbGVtZW50LmFwcGVuZC5iaW5kKCRlbGVtZW50KSk7XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhclxuICBzaG93ZG93biA9IHJlcXVpcmUoJ3Nob3dkb3duJyksXG4gIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5jb252ZXJ0ZXIoKVxuO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY2Upe1xuICByZXR1cm4gZnVuY3Rpb24oc291cmNlKXtcbiAgICByZXR1cm4gc291cmNlICYmICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKHNvdXJjZSkpO1xuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpXG47XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24od2lkZ2V0RGVmKXtcbiAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKHt9LCB7XG4gICAgLy9kZWZhdWx0c1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6ICcnLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgc2NvcGU6IHt9LFxuICAgIGRlZmF1bHRzOiB7fSxcblxuICAgIC8vYWN0dWFsIHN0dWZmXG4gICAgY29tcGlsZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByZTogdGhpcy5wcmVsaW5rLmJpbmQodGhpcyksXG4gICAgICAgIHBvc3Q6IHRoaXMubGluayAmJiB0aGlzLmxpbmsuYmluZCh0aGlzKVxuICAgICAgfTtcbiAgICB9LFxuXG4gICAgcHJlbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKXtcbiAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwgYW5ndWxhci5jb3B5KHRoaXMuZGVmYXVsdHMpKTtcblxuICAgICAgZm9yICh2YXIgayBpbiAkYXR0cnMuJGF0dHIpe1xuICAgICAgICAkc2NvcGVba10gPSAkYXR0cnNba107XG5cbiAgICAgICAgaWYgKCRhdHRycy4kJG9ic2VydmVycyAmJiAkYXR0cnMuJCRvYnNlcnZlcnNba10pe1xuICAgICAgICAgICRhdHRycy4kb2JzZXJ2ZShrLCBkb3RTZXQoJHNjb3BlLCBrKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHdpZGdldERlZik7XG59O1xuXG5mdW5jdGlvbiBkb3RTZXQob2JqLCBwcm9wKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgb2JqW3Byb3BdID0gdmFsO1xuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiBuZy1jbGFzcz1cIiB7XFwnaGFzLWVycm9yXFwnOiBuZ01vZGVsLiRkaXJ0eSAmJiBuZ01vZGVsLiRpbnZhbGlkfSBcIj4nICtcbiAgICAgICcgIDxsYWJlbCBuZy1zaG93PVwiIGxhYmVsIFwiIGNsYXNzPVwiY29udHJvbC1sYWJlbFwiPnt7IGxhYmVsIH19PC9sYWJlbD4nICtcbiAgICAgICcgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICc8L2Rpdj4nLFxuXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCl7XG4gICAgICB2YXIgY29udHJvbCA9ICRlbGVtZW50LmZpbmQoJ3RleHRhcmVhLCBzZWxlY3QsIGlucHV0Om5vdChbdHlwZT1cInJhZGlvXCJdKTpub3QoW3R5cGU9XCJjaGVja2JveFwiXSknKTtcblxuICAgICAgJHNjb3BlLm5nTW9kZWwgPSBjb250cm9sLmNvbnRyb2xsZXIoJ25nTW9kZWwnKTtcblxuICAgICAgY29udHJvbC5hZGRDbGFzcygnZm9ybS1jb250cm9sJyk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgJHNjb3BlLnRlbXBsYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHRtbCB8fCAoJ3t7IGl0W1wiJyArIHRoaXMuaW5kZXggKyAnXCJdIH19Jyk7XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIGN0cmxzLCAkdHJhbnNjbHVkZSl7XG4gICAgICAvL2NvcHkgY29udGVudHMgKFRPRE86ICRob3N0KVxuICAgICAgdmFyIHRtcCA9ICRlbGVtZW50LmNsb25lKCkuaHRtbCgnJyk7XG4gICAgICAkdHJhbnNjbHVkZSh0aGlzLCB0bXAuYXBwZW5kLmJpbmQodG1wKSk7XG5cbiAgICAgICRzY29wZS5odG1sID0gdG1wLmZpbmQoJ3RlbXBsYXRlJykuaHRtbCgpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9jYXJyZXQgdmlzaWJpbGl0eVxuICAgICAgJ253LWdyaWQgdGggaS5mYXt2aXNpYmlsaXR5OiBoaWRkZW59JyArXG4gICAgICAnbnctZ3JpZCB0aC5hY3RpdmUgaS5mYXt2aXNpYmlsaXR5OiB2aXNpYmxlfScgK1xuXG4gICAgICAvL2Jvb3RzdHJhcCBidWc/IHN0cmlwZWQgKyBob3ZlciArIGFjdGl2ZVxuICAgICAgJ253LWdyaWQgdHIuYWN0aXZlIHRke2JhY2tncm91bmQ6ICM2OGMgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudH0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAvL3RyYW5zY2x1ZGUgY29sdW1ucyAoVE9ETzogbWFrZSBuZ1dpZGdldCgpIGF1dG9tYXRpY2FsbHkgdHJhbnNjbHVkZSBldmVyeXRoaW5nKVxuICAgICAgJzxjb250ZW50PjwvY29udGVudD4nICtcblxuICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtaG92ZXIgdGFibGUtYm9yZGVyZWRcIj4nICtcbiAgICAgICcgIDx0aGVhZD4nICtcbiAgICAgICcgICAgPHRyPicgK1xuICAgICAgJyAgICA8dGgnICtcbiAgICAgICcgICAgICBuZy1yZXBlYXQ9XCIgY29sIGluIGNvbHMgXCIgJyArXG4gICAgICAnICAgICAgbmctY2xhc3M9XCIge2FjdGl2ZTogY29sID09IHNvcnRDb2x9IFwiICcgK1xuICAgICAgJyAgICAgIG5nLWNsaWNrPVwiICRwYXJlbnQucmV2ZXJzZSA9ICgoY29sID09IHNvcnRDb2wpICYmICFyZXZlcnNlKTsgJHBhcmVudC5zb3J0Q29sID0gY29sIFwiICcgK1xuICAgICAgJyAgICA+JyArXG4gICAgICAnICAgICAge3sgY29sLm5hbWUgfX0gJyArXG4gICAgICAnICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jYXJldC17eyByZXZlcnNlID9cXCdkb3duXFwnIDpcXCd1cFxcJyB9fSBwdWxsLXJpZ2h0XCI+PC9pPicgK1xuICAgICAgJyAgICA8L3RoPicgK1xuICAgICAgJyAgICA8L3RyPicgK1xuICAgICAgJyAgPC90aGVhZD4nICtcbiAgICAgICcgIDx0Ym9keT4nICtcbiAgICAgICcgICAgPHRyPjx0ZD5WYWx1ZTwvdGQ+PC90cj4nICtcbiAgICAgICcgIDwvdGJvZHk+JyArXG4gICAgICAnPC90YWJsZT4nLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGNvbHM6IFtdLFxuICAgICAgYXV0b3NvcnQ6IHRydWVcbiAgICB9LFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS4kd2F0Y2goJ2NvbHMnLCBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJHNjb3BlLmF1dG9zb3J0KXtcbiAgICAgICAgICAkc2NvcGUuc29ydENvbCA9ICRzY29wZS5jb2xzWzBdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCl7XG4gICAgICAvL2luaXRpYWxpemUgdXNpbmcgZWxlbWVudHNcbiAgICAgIHZhclxuICAgICAgICBjb2xFbHMgPSAkZWxlbWVudC5maW5kKCdudy1ncmlkLWNvbCcpLFxuICAgICAgICB0ciA9ICRlbGVtZW50LmZpbmQoJ3Rib2R5IHRyJyksXG4gICAgICAgIHRySHRtbCA9ICcnXG4gICAgICA7XG5cbiAgICAgIC8vVE9ETzogdGhpcyBzaG91bGQgYmUgaW4gY29udHJvbGxlciwgYnV0IGl0cyB0b28gZWFybHkgKGF0dHJpYnV0ZXMgYXJlIG5vdCBib3VuZClcbiAgICAgIC8vICBbXSBzdXBwb3J0IG1pZ2h0IHNvbHZlIHRoaXNcbiAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaENvbGxlY3Rpb24oJHNjb3BlLml0ZW1zLCBmdW5jdGlvbihpdGVtc0NvbGwpe1xuICAgICAgICAkc2NvcGUuaXRlbXNDb2xsID0gaXRlbXNDb2xsIHx8IFtdO1xuICAgICAgfSk7XG5cbiAgICAgIC8vVE9ETzogdGhpcyBpcyBuYXN0eSwgd291bGQgYmUgbXVjaCBiZXR0ZXIgdG8gZ2V0IGFsbCBob3N0RWxlbWVudCBzY29wZXMgaW4gYXJyYXlcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChjb2xFbHMsIGZ1bmN0aW9uKGNvbEVsKXtcbiAgICAgICAgJHNjb3BlLmNvbHMucHVzaChhbmd1bGFyLmVsZW1lbnQoY29sRWwpLmlzb2xhdGVTY29wZSgpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvL2luaXQgcmVwZWF0ZXJcbiAgICAgIHRyLmF0dHIoJ25nLXJlcGVhdCcsICcgaXQgaW4gaXRlbXNDb2xsIHwgb3JkZXJCeTpzb3J0Q29sLmluZGV4OnJldmVyc2UgJyk7XG5cbiAgICAgICRzY29wZS5jb2xzLmZvckVhY2goZnVuY3Rpb24oY29sKXtcbiAgICAgICAgdHJIdG1sICs9ICc8dGQ+JyArIGNvbC50ZW1wbGF0ZSgpICsgJzwvdGQ+JztcbiAgICAgIH0pO1xuXG4gICAgICAvL1RPRE86IGZpbmQgYmV0dGVyIHdheSB0byBjb21waWxlIG5ldyBlbGVtZW50cyBpbiBsaW5rIHBoYXNlXG4gICAgICAkZWxlbWVudC5pbmplY3RvcigpLmdldCgnJGNvbXBpbGUnKSh0ci5odG1sKHRySHRtbCkpKCRzY29wZSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTogJzxwPnt7IGxpcHN1bSB9fTwvcD4nLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGxpcHN1bTogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uJ1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHVsIG5nLXNob3c9XCIgaXRlbXNDb2xsIFwiIGNsYXNzPVwie3sgbGlzdENsYXNzIH19XCI+JyArXG4gICAgICAnICA8bGkgbmctcmVwZWF0PVwiIGl0IGluIGl0ZW1zQ29sbCBcIiBuZy1jbGFzcz1cInsge3sgYWN0aXZlQ2xhc3MgfX06IGl0ID09IG5nTW9kZWwuJG1vZGVsVmFsdWUgfVwiPicgK1xuICAgICAgJyAgICA8YSBocmVmPVwiXCIgbmctY2xpY2s9XCIgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGl0KSBcIj57eyBpdC5uYW1lIH19PC9hPicgK1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicgK1xuICAgICAgJzxwIG5nLWhpZGU9XCIgaXRlbXNDb2xsIFwiPnt7IGVtcHR5VGV4dCB9fTwvcD4nLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIGVtcHR5VGV4dDogJ05vIGl0ZW1zIGZvdW5kJyxcbiAgICAgIGFjdGl2ZUNsYXNzOiAnYWN0aXZlJ1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KXtcbiAgICAgICRzY29wZS5uZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKCRzY29wZS5pdGVtcywgZnVuY3Rpb24oaXRlbXNDb2xsKXtcbiAgICAgICAgJHNjb3BlLml0ZW1zQ29sbCA9IGl0ZW1zQ29sbCB8fCBbXTtcbiAgICAgIH0pO1xuXG4gICAgICAvL2lmICgnYXV0b3NlbGVjdCcgaW4gJHNjb3BlKXtcbiAgICAgIC8vXG4gICAgICAvL31cbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOiAnbnctbW9kYWwgLm1vZGFse2Rpc3BsYXk6IGJsb2NrfScsXG5cbiAgICAvL29wdGlvbmFsIGZ1bGwtaGVpZ2h0IHN0eWxlc1xuICAgIC8vVE9ETzogY29uc2lkZXIgaW50cm9kdWNpbmcgbmV3IGVsZW1lbnRcbiAgICAvL1RPRE86IGNvbnNpZGVyIHJlbGF0aW9uIHRvIG92ZXJsYXlcbiAgICAvL1xuICAgIC8vIG53LW1vZGFsIC5tb2RhbC1jb250ZW50e2JvcmRlci1yYWRpdXM6IDA7IGJvcmRlcjogMDsgaGVpZ2h0OiAxMDAlfVxuICAgIC8vIG53LW1vZGFsIC5tb2RhbC1kaWFsb2d7cG9zaXRpb246IGZpeGVkOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBtYXJnaW46IDA7IHRvcDogMDsgbGVmdDogMH1cblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJtb2RhbFwiIHJvbGU9XCJkaWFsb2dcIj48ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIiBuZy1zaG93PVwiIG5hbWUgXCI+PGgzIGNsYXNzPVwibW9kYWwtdGl0bGVcIj57eyBuYW1lIH19PC9oMz48L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+JyArXG4gICAgICAnICAgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICcgIDwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiIG5nLXNob3c9XCIgZm9vdGVyIFwiPnt7IGZvb3RlciB9fTwvZGl2PicgK1xuICAgICAgJzwvZGl2PjwvZGl2PjwvZGl2PidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLXt7IHR5cGUgfX1cIj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgbmctc2hvdz1cIiBuYW1lIFwiPnt7IG5hbWUgfX08L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+JyArXG4gICAgICAnICAgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICcgIDwvZGl2PicgK1xuICAgICAgJzwvZGl2PicsXG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgdHlwZTogJ2RlZmF1bHQnXG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJyb3dcIj48Y29udGVudD48L2NvbnRlbnQ+PC9kaXY+JyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpe1xuICAgICAgJGVsZW1lbnQuZmluZCgnLnJvdyA+IGNvbnRlbnQnKS5jaGlsZHJlbigpLmFkZENsYXNzKCRhdHRycy5pdGVtQ2xhc3MpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8Y29udGVudCBuZy1zaG93PVwiIGFjdGl2ZSBcIj48L2NvbnRlbnQ+JyxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIG53VGFic0VsID0gJGVsZW1lbnQucGFyZW50KCkucGFyZW50KCk7XG5cbiAgICAgIG53VGFic0VsLmlzb2xhdGVTY29wZSgpLnRhYnMucHVzaCgkc2NvcGUpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy10YWJzIG53LWxpc3R7ZGlzcGxheTogYmxvY2s7IG1hcmdpbi1ib3R0b206IDFlbX0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPG53LWxpc3QgaXRlbXM9XCIgdGFicyBcIiBsaXN0LWNsYXNzPVwibmF2IG5hdi10YWJzXCIgbmctbW9kZWw9XCIgYWN0aXZlVGFiIFwiPjwvbnctbGlzdD4nICtcbiAgICAgICc8Y29udGVudD48L2NvbnRlbnQ+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICB0YWJzOiBbXVxuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJ3RhYnMnLCBmdW5jdGlvbih0YWJzKXtcbiAgICAgICAgJHNjb3BlLmFjdGl2ZVRhYiA9ICRzY29wZS5hY3RpdmVUYWIgfHwgdGFic1swXTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdhY3RpdmVUYWInLCBmdW5jdGlvbihhY3RpdmVUYWIpe1xuICAgICAgICAkc2NvcGUudGFicy5mb3JFYWNoKGZ1bmN0aW9uKHRhYil7XG4gICAgICAgICAgdGFiLmFjdGl2ZSA9ICh0YWIgPT09IGFjdGl2ZVRhYik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gIHZhciByZXMgPSBbXTtcblxuICBbXS5mb3JFYWNoLmNhbGwodGhpcywgZnVuY3Rpb24oZWwpe1xuICAgIHJlcy5wdXNoLmFwcGx5KHJlcywgZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICB9KTtcblxuICByZXR1cm4gYW5ndWxhci5lbGVtZW50KHJlcyk7XG59OyJdfQ==
