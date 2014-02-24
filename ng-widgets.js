(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};'use strict';

var
  angular = require('angular'),
  ngWidgets = angular.module('ng-widgets', []),

  jQuery = global.jQuery
;

module.exports = ngWidgets;

//TODO: test
//quick and dirty
if ( ! jQuery){
  angular.element.prototype.find = require('./src/utils/qsa.js');
}

ngWidgets
  .value('ngWidget', require('./src/utils/ng-widget.js'))
  .filter('markdown', require('./src/utils/markdown.js'))
  .directive('content', require('./src/utils/content'))
  .directive('nwLipsum', require('./src/utils/nw-lipsum'))


  .directive('nwBtn', require('./src/basics/nw-btn'))
  .directive('nwNavbar', require('./src/basics/nw-navbar'))
  .directive('nwList', require('./src/basics/nw-list'))
  .directive('nwItem', require('./src/basics/nw-item'))
  .directive('nwPanel', require('./src/basics/nw-panel'))
  .directive('nwModal', require('./src/basics/nw-modal'))
  .directive('nwGrid', require('./src/basics/nw-grid'))
  .directive('nwGridCol', require('./src/basics/nw-grid-col'))
  .directive('nwTabs', require('./src/basics/nw-tabs'))
  .directive('nwTab', require('./src/basics/nw-tab'))

  .directive('nwField', require('./src/forms/nw-field'))
  .directive('nwSaveBtn', require('./src/forms/nw-save-btn'))
  .directive('nwDeleteBtn', require('./src/forms/nw-delete-btn'))
;
},{"./src/basics/nw-btn":4,"./src/basics/nw-grid":6,"./src/basics/nw-grid-col":5,"./src/basics/nw-item":7,"./src/basics/nw-list":8,"./src/basics/nw-modal":9,"./src/basics/nw-navbar":10,"./src/basics/nw-panel":11,"./src/basics/nw-tab":12,"./src/basics/nw-tabs":13,"./src/forms/nw-delete-btn":14,"./src/forms/nw-field":15,"./src/forms/nw-save-btn":16,"./src/utils/content":17,"./src/utils/markdown.js":18,"./src/utils/ng-widget.js":19,"./src/utils/nw-lipsum":20,"./src/utils/qsa.js":21,"angular":2}],2:[function(require,module,exports){
'use strict';

module.exports = window.angular;
},{}],3:[function(require,module,exports){
'use strict';

module.exports = window.Showdown;
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<a class="btn btn-{{ type }}">' +
      '  <i class="fa fa-{{ icon }}" ng-show=" icon "></i>' +
      '  {{ name }}' +
      '</a>',

    defaults: {
      name: '',
      icon: '',
      type: 'default'
    }
  });
};
},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    require: ['^nwGrid'],

    template: '<content></content>',

    defaults: {
      name: '',
      index: ''
    },

    controller: function($scope){
      $scope.template = function(){
        return this.html || ('{{ it["' + this.index + '"] }}');
      };
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        gridCtrl = ctrls[0]
      ;

      gridCtrl.addCol($scope);

      $scope.$on('$destroy', gridCtrl.removeCol.bind(gridCtrl, $scope));

      $scope.html = $element.find('template').html();
    }
  });
};
},{}],6:[function(require,module,exports){
'use strict';

var
  angular = require('angular'),
  _ = require('../utils/utils')
;

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
      items: [],
      cols: [],
      autosort: true
    },

    controller: function($scope, $compile){
      var
        gridCtrl = this
      ;

      gridCtrl.addCol = function(col){
        $scope.cols.push(col);
      };

      gridCtrl.removeCol = function(col){
        _.pull($scope.cols, col);
      };

      //TODO: injector during
      $scope.$compile = $compile;

      $scope.$watch('cols', function(){
        if ($scope.autosort){
          $scope.sortCol = $scope.cols[0];
        }
      });
    },

    link: function($scope, $element){
      //initialize using elements
      var
        tr = $element.find('tbody tr'),
        trHtml = ''
      ;

      //init repeater
      tr.attr('ng-repeat', ' it in items | orderBy:sortCol.index:reverse ');

      $scope.cols.forEach(function(col){
        trHtml += '<td>' + col.template() + '</td>';
      });

      //TODO: find better way to compile new elements in link phase
      $scope.$compile(tr.html(trHtml))($scope);
    }
  });
};
},{"../utils/utils":22,"angular":2}],7:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    require: ['^nwList'],

    defaults: {
      name: '',
      href: ''
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        listCtrl = ctrls[0]
      ;

      listCtrl.addItem($scope);

      $scope.$on('$destroy', listCtrl.removeItem.bind(listCtrl, $scope));
    }
  });
};
},{}],8:[function(require,module,exports){
'use strict';

var
  _ = require('../utils/utils')
;

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<content></content>' +
      '<ul ng-show=" items " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in items " ng-class="{ {{ activeClass }}: it == ngModel.$modelValue }">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items ">{{ emptyText }}</p>',

    defaults: {
      items: [],
      emptyText: 'No items found',
      activeClass: 'active',
      listClass: '',
      autoselect: false
    },

    controller: function($scope){
      var
        listCtrl = this
      ;

      listCtrl.addItem = function(item){
        $scope.items.push(item);
      };

      listCtrl.removeItem = function(item){
        _.pull($scope.items, item);
      };
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      $scope.$watch('ngModel && ( ! ngModel.$modelValue) && autoselect && items', function(items){
        if (items){
          $scope.ngModel.$setViewValue(items[Object.keys(items)[0]]);
        }
      });
    }
  });
};
},{"../utils/utils":22}],9:[function(require,module,exports){
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
      '</div></div></div>',

    defaults: {
      name: '',
      footer: ''
    }
  });
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<nav class="navbar navbar-{{ type }} {{ navbarClass }}" role="navigation">' +
      '  <a href="" class="navbar-brand" ng-show=" name ">{{ name }}</a>' +
      '  <content></content>' +
      '</nav>',

    defaults: {
      name: '',
      type: 'default',
      navbarClass: ''
    }
  });
};
},{}],11:[function(require,module,exports){
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
      name: '',
      type: 'default'
    }
  });
};
},{}],12:[function(require,module,exports){
'use strict';

//TODO: consider renaming to <nw-section
//  (introduce & support accordion)
module.exports = function(ngWidget){
  return ngWidget({
    require: ['^nwTabs'],

    template: '<content ng-show=" active "></content>',

    defaults: {
      name: ''
    },

    link: function($scope, $element, $attrs, ctrls){
      var
        tabsCtrl = ctrls[0]
      ;

      tabsCtrl.addTab($scope);

      $scope.$on('$destroy', tabsCtrl.removeTab.bind(tabsCtrl, $scope));
    }
  });
};
},{}],13:[function(require,module,exports){
'use strict';

var
  _ = require('../utils/utils')
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
},{"../utils/utils":22}],14:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<nw-btn icon="trash-o" ng-click=" record.$delete() "></nw-btn>',

    defaults: {
      record: {}
    }
  });
};
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<nw-btn icon="save" ng-click=" record.$save() "></nw-btn>',

    defaults: {
      record: {}
    }
  });
};
},{}],17:[function(require,module,exports){
'use strict';

module.exports = function(){
  return {
    restrict: 'E',
    controller: function($scope, $element, $transclude){
      $transclude($scope.$host, $element.append.bind($element));
    }
  };
};
},{}],18:[function(require,module,exports){
'use strict';

//TODO: test
try{
  var
    angular = require('angular'),
    showdown = require('showdown'),
    converter = new showdown.converter(),
    makeHtml = converter.makeHtml.bind(converter)
  ;
} catch(e){
  makeHtml = angular.identity;
}

module.exports = function($sce, $log){
  if ( ! showdown){
    $log.error('Showdown library not available.');
  }

  return function(source){
    return source && $sce.trustAsHtml(makeHtml(fixEmail(source)));
  };
};

function fixEmail(markdown){
  return markdown.replace(/<(\w+\@\w+\.\w+)>/g, '<a href="mailto:$1">$1</a>');
}
},{"angular":2,"showdown":3}],19:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};'use strict';

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
    $scope.$host = $scope.$parent;
    angular.extend($scope, angular.copy(this.defaults));

    bindAttributes($scope, $attrs, this.defaults);
  }
};

function bindAttributes($scope, $attrs, defaults){
  for (var k in $attrs.$attr){
    $scope[k] = $attrs[k];

    //TODO: test (partially covered by nw-* widgets)
    //most wanted
    if (defaults[k] instanceof Object){
      $scope[k] = $scope.$parent.$eval($attrs[k]);
      $scope.$parent.$watchCollection($attrs[k], dotSet($scope, k));
      continue;
    }

    //boolean expressions
    if (typeof defaults[k] === 'boolean'){
      $scope[k] = $scope.$parent.$eval($attrs[k]);
      $scope.$parent.$watch($attrs[k], dotSet($scope, k));
      continue;
    }

    //string interpolation
    if ($attrs.$$observers && $attrs.$$observers[k]){
      $attrs.$observe(k, dotSet($scope, k));
    }
  }
}

function dotSet(obj, prop){
  return function(val){
    obj[prop] = val;
  };
}
},{"angular":2}],20:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<p>{{ lipsum }}</p>',

    defaults: {
      lipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  });
};
},{}],21:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(selector){
  var res = [];

  [].forEach.call(this, function(el){
    res.push.apply(res, [].slice.call(el.querySelectorAll(selector)));
  });

  return angular.element(res);
};
},{"angular":2}],22:[function(require,module,exports){
'use strict';

module.exports = {
  pull: function(arr, item){
    var idx = arr.indexOf(item);

    return (~idx) && arr.splice(idx, 1);
  }
};
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZy13aWRnZXRzL2Zha2VfMjM4ZDliN2MuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc2hpbXMvYW5ndWxhci5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zaGltcy9zaG93ZG93bi5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvYmFzaWNzL253LWJ0bi5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvYmFzaWNzL253LWdyaWQtY29sLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZy13aWRnZXRzL3NyYy9iYXNpY3MvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvYmFzaWNzL253LWl0ZW0uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL2Jhc2ljcy9udy1saXN0LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZy13aWRnZXRzL3NyYy9iYXNpY3MvbnctbW9kYWwuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL2Jhc2ljcy9udy1uYXZiYXIuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL2Jhc2ljcy9udy1wYW5lbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvYmFzaWNzL253LXRhYi5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvYmFzaWNzL253LXRhYnMuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL2Zvcm1zL253LWRlbGV0ZS1idG4uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL2Zvcm1zL253LWZpZWxkLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZy13aWRnZXRzL3NyYy9mb3Jtcy9udy1zYXZlLWJ0bi5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvdXRpbHMvY29udGVudC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvdXRpbHMvbWFya2Rvd24uanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL3V0aWxzL25nLXdpZGdldC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmctd2lkZ2V0cy9zcmMvdXRpbHMvbnctbGlwc3VtLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZy13aWRnZXRzL3NyYy91dGlscy9xc2EuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nLXdpZGdldHMvc3JjL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTsndXNlIHN0cmljdCc7XG5cbnZhclxuICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICBuZ1dpZGdldHMgPSBhbmd1bGFyLm1vZHVsZSgnbmctd2lkZ2V0cycsIFtdKSxcblxuICBqUXVlcnkgPSBnbG9iYWwualF1ZXJ5XG47XG5cbm1vZHVsZS5leHBvcnRzID0gbmdXaWRnZXRzO1xuXG4vL1RPRE86IHRlc3Rcbi8vcXVpY2sgYW5kIGRpcnR5XG5pZiAoICEgalF1ZXJ5KXtcbiAgYW5ndWxhci5lbGVtZW50LnByb3RvdHlwZS5maW5kID0gcmVxdWlyZSgnLi9zcmMvdXRpbHMvcXNhLmpzJyk7XG59XG5cbm5nV2lkZ2V0c1xuICAudmFsdWUoJ25nV2lkZ2V0JywgcmVxdWlyZSgnLi9zcmMvdXRpbHMvbmctd2lkZ2V0LmpzJykpXG4gIC5maWx0ZXIoJ21hcmtkb3duJywgcmVxdWlyZSgnLi9zcmMvdXRpbHMvbWFya2Rvd24uanMnKSlcbiAgLmRpcmVjdGl2ZSgnY29udGVudCcsIHJlcXVpcmUoJy4vc3JjL3V0aWxzL2NvbnRlbnQnKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXBzdW0nLCByZXF1aXJlKCcuL3NyYy91dGlscy9udy1saXBzdW0nKSlcblxuXG4gIC5kaXJlY3RpdmUoJ253QnRuJywgcmVxdWlyZSgnLi9zcmMvYmFzaWNzL253LWJ0bicpKVxuICAuZGlyZWN0aXZlKCdud05hdmJhcicsIHJlcXVpcmUoJy4vc3JjL2Jhc2ljcy9udy1uYXZiYXInKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXN0JywgcmVxdWlyZSgnLi9zcmMvYmFzaWNzL253LWxpc3QnKSlcbiAgLmRpcmVjdGl2ZSgnbndJdGVtJywgcmVxdWlyZSgnLi9zcmMvYmFzaWNzL253LWl0ZW0nKSlcbiAgLmRpcmVjdGl2ZSgnbndQYW5lbCcsIHJlcXVpcmUoJy4vc3JjL2Jhc2ljcy9udy1wYW5lbCcpKVxuICAuZGlyZWN0aXZlKCdud01vZGFsJywgcmVxdWlyZSgnLi9zcmMvYmFzaWNzL253LW1vZGFsJykpXG4gIC5kaXJlY3RpdmUoJ253R3JpZCcsIHJlcXVpcmUoJy4vc3JjL2Jhc2ljcy9udy1ncmlkJykpXG4gIC5kaXJlY3RpdmUoJ253R3JpZENvbCcsIHJlcXVpcmUoJy4vc3JjL2Jhc2ljcy9udy1ncmlkLWNvbCcpKVxuICAuZGlyZWN0aXZlKCdud1RhYnMnLCByZXF1aXJlKCcuL3NyYy9iYXNpY3MvbnctdGFicycpKVxuICAuZGlyZWN0aXZlKCdud1RhYicsIHJlcXVpcmUoJy4vc3JjL2Jhc2ljcy9udy10YWInKSlcblxuICAuZGlyZWN0aXZlKCdud0ZpZWxkJywgcmVxdWlyZSgnLi9zcmMvZm9ybXMvbnctZmllbGQnKSlcbiAgLmRpcmVjdGl2ZSgnbndTYXZlQnRuJywgcmVxdWlyZSgnLi9zcmMvZm9ybXMvbnctc2F2ZS1idG4nKSlcbiAgLmRpcmVjdGl2ZSgnbndEZWxldGVCdG4nLCByZXF1aXJlKCcuL3NyYy9mb3Jtcy9udy1kZWxldGUtYnRuJykpXG47IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5hbmd1bGFyOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuU2hvd2Rvd247IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8YSBjbGFzcz1cImJ0biBidG4te3sgdHlwZSB9fVwiPicgK1xuICAgICAgJyAgPGkgY2xhc3M9XCJmYSBmYS17eyBpY29uIH19XCIgbmctc2hvdz1cIiBpY29uIFwiPjwvaT4nICtcbiAgICAgICcgIHt7IG5hbWUgfX0nICtcbiAgICAgICc8L2E+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIGljb246ICcnLFxuICAgICAgdHlwZTogJ2RlZmF1bHQnXG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICByZXF1aXJlOiBbJ15ud0dyaWQnXSxcblxuICAgIHRlbXBsYXRlOiAnPGNvbnRlbnQ+PC9jb250ZW50PicsXG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgbmFtZTogJycsXG4gICAgICBpbmRleDogJydcbiAgICB9LFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgICRzY29wZS50ZW1wbGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmh0bWwgfHwgKCd7eyBpdFtcIicgKyB0aGlzLmluZGV4ICsgJ1wiXSB9fScpO1xuICAgICAgfTtcbiAgICB9LFxuXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscyl7XG4gICAgICB2YXJcbiAgICAgICAgZ3JpZEN0cmwgPSBjdHJsc1swXVxuICAgICAgO1xuXG4gICAgICBncmlkQ3RybC5hZGRDb2woJHNjb3BlKTtcblxuICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCBncmlkQ3RybC5yZW1vdmVDb2wuYmluZChncmlkQ3RybCwgJHNjb3BlKSk7XG5cbiAgICAgICRzY29wZS5odG1sID0gJGVsZW1lbnQuZmluZCgndGVtcGxhdGUnKS5odG1sKCk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKSxcbiAgXyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6XG4gICAgICAvL2hhbmQgKyB1bnNlbGVjdGFibGVcbiAgICAgICdudy1ncmlkIHRoZWFkIHRoe2N1cnNvcjogcG9pbnRlcjsgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7IC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7IC1tcy11c2VyLXNlbGVjdDogbm9uZTsgdXNlci1zZWxlY3Q6IG5vbmV9JyArXG4gICAgICAnbnctZ3JpZFtuZy1tb2RlbF0gdGJvZHkgdHJ7Y3Vyc29yOiBwb2ludGVyfScgK1xuXG4gICAgICAvL2NhcnJldCB2aXNpYmlsaXR5XG4gICAgICAnbnctZ3JpZCB0aCBpLmZhe3Zpc2liaWxpdHk6IGhpZGRlbn0nICtcbiAgICAgICdudy1ncmlkIHRoLmFjdGl2ZSBpLmZhe3Zpc2liaWxpdHk6IHZpc2libGV9JyArXG5cbiAgICAgIC8vYm9vdHN0cmFwIGJ1Zz8gc3RyaXBlZCArIGhvdmVyICsgYWN0aXZlXG4gICAgICAnbnctZ3JpZCB0ci5hY3RpdmUgdGR7YmFja2dyb3VuZDogIzY4YyAhaW1wb3J0YW50OyBjb2xvcjogI2ZmZiAhaW1wb3J0YW50fScsXG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ob3ZlciB0YWJsZS1ib3JkZXJlZFwiPicgK1xuICAgICAgJyAgPHRoZWFkPicgK1xuICAgICAgJyAgICA8dHI+JyArXG4gICAgICAnICAgIDx0aCcgK1xuICAgICAgJyAgICAgIG5nLXJlcGVhdD1cIiBjb2wgaW4gY29scyBcIiAnICtcbiAgICAgICcgICAgICBuZy1jbGFzcz1cIiB7YWN0aXZlOiBjb2wgPT0gc29ydENvbH0gXCIgJyArXG4gICAgICAnICAgICAgbmctY2xpY2s9XCIgJHBhcmVudC5yZXZlcnNlID0gKChjb2wgPT0gc29ydENvbCkgJiYgIXJldmVyc2UpOyAkcGFyZW50LnNvcnRDb2wgPSBjb2wgXCIgJyArXG4gICAgICAnICAgID4nICtcbiAgICAgICcgICAgICB7eyBjb2wubmFtZSB9fSAnICtcbiAgICAgICcgICAgICA8aSBjbGFzcz1cImZhIGZhLWNhcmV0LXt7IHJldmVyc2UgP1xcJ2Rvd25cXCcgOlxcJ3VwXFwnIH19IHB1bGwtcmlnaHRcIj48L2k+JyArXG4gICAgICAnICAgIDwvdGg+JyArXG4gICAgICAnICAgIDwvdHI+JyArXG4gICAgICAnICA8L3RoZWFkPicgK1xuICAgICAgJyAgPHRib2R5PicgK1xuICAgICAgJyAgICA8dHI+PHRkPlZhbHVlPC90ZD48L3RyPicgK1xuICAgICAgJyAgPC90Ym9keT4nICtcbiAgICAgICc8L3RhYmxlPicsXG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgY29sczogW10sXG4gICAgICBhdXRvc29ydDogdHJ1ZVxuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRjb21waWxlKXtcbiAgICAgIHZhclxuICAgICAgICBncmlkQ3RybCA9IHRoaXNcbiAgICAgIDtcblxuICAgICAgZ3JpZEN0cmwuYWRkQ29sID0gZnVuY3Rpb24oY29sKXtcbiAgICAgICAgJHNjb3BlLmNvbHMucHVzaChjb2wpO1xuICAgICAgfTtcblxuICAgICAgZ3JpZEN0cmwucmVtb3ZlQ29sID0gZnVuY3Rpb24oY29sKXtcbiAgICAgICAgXy5wdWxsKCRzY29wZS5jb2xzLCBjb2wpO1xuICAgICAgfTtcblxuICAgICAgLy9UT0RPOiBpbmplY3RvciBkdXJpbmdcbiAgICAgICRzY29wZS4kY29tcGlsZSA9ICRjb21waWxlO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdjb2xzJywgZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCRzY29wZS5hdXRvc29ydCl7XG4gICAgICAgICAgJHNjb3BlLnNvcnRDb2wgPSAkc2NvcGUuY29sc1swXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgLy9pbml0aWFsaXplIHVzaW5nIGVsZW1lbnRzXG4gICAgICB2YXJcbiAgICAgICAgdHIgPSAkZWxlbWVudC5maW5kKCd0Ym9keSB0cicpLFxuICAgICAgICB0ckh0bWwgPSAnJ1xuICAgICAgO1xuXG4gICAgICAvL2luaXQgcmVwZWF0ZXJcbiAgICAgIHRyLmF0dHIoJ25nLXJlcGVhdCcsICcgaXQgaW4gaXRlbXMgfCBvcmRlckJ5OnNvcnRDb2wuaW5kZXg6cmV2ZXJzZSAnKTtcblxuICAgICAgJHNjb3BlLmNvbHMuZm9yRWFjaChmdW5jdGlvbihjb2wpe1xuICAgICAgICB0ckh0bWwgKz0gJzx0ZD4nICsgY29sLnRlbXBsYXRlKCkgKyAnPC90ZD4nO1xuICAgICAgfSk7XG5cbiAgICAgIC8vVE9ETzogZmluZCBiZXR0ZXIgd2F5IHRvIGNvbXBpbGUgbmV3IGVsZW1lbnRzIGluIGxpbmsgcGhhc2VcbiAgICAgICRzY29wZS4kY29tcGlsZSh0ci5odG1sKHRySHRtbCkpKCRzY29wZSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICByZXF1aXJlOiBbJ15ud0xpc3QnXSxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIGhyZWY6ICcnXG4gICAgfSxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgY3RybHMpe1xuICAgICAgdmFyXG4gICAgICAgIGxpc3RDdHJsID0gY3RybHNbMF1cbiAgICAgIDtcblxuICAgICAgbGlzdEN0cmwuYWRkSXRlbSgkc2NvcGUpO1xuXG4gICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGxpc3RDdHJsLnJlbW92ZUl0ZW0uYmluZChsaXN0Q3RybCwgJHNjb3BlKSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgXyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJzx1bCBuZy1zaG93PVwiIGl0ZW1zIFwiIGNsYXNzPVwie3sgbGlzdENsYXNzIH19XCI+JyArXG4gICAgICAnICA8bGkgbmctcmVwZWF0PVwiIGl0IGluIGl0ZW1zIFwiIG5nLWNsYXNzPVwieyB7eyBhY3RpdmVDbGFzcyB9fTogaXQgPT0gbmdNb2RlbC4kbW9kZWxWYWx1ZSB9XCI+JyArXG4gICAgICAnICAgIDxhIGhyZWY9XCJcIiBuZy1jbGljaz1cIiBuZ01vZGVsLiRzZXRWaWV3VmFsdWUoaXQpIFwiPnt7IGl0Lm5hbWUgfX08L2E+JyArXG4gICAgICAnICA8L2xpPicgK1xuICAgICAgJzwvdWw+JyArXG4gICAgICAnPHAgbmctaGlkZT1cIiBpdGVtcyBcIj57eyBlbXB0eVRleHQgfX08L3A+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBlbXB0eVRleHQ6ICdObyBpdGVtcyBmb3VuZCcsXG4gICAgICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXG4gICAgICBsaXN0Q2xhc3M6ICcnLFxuICAgICAgYXV0b3NlbGVjdDogZmFsc2VcbiAgICB9LFxuXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbiAgICAgIHZhclxuICAgICAgICBsaXN0Q3RybCA9IHRoaXNcbiAgICAgIDtcblxuICAgICAgbGlzdEN0cmwuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAkc2NvcGUuaXRlbXMucHVzaChpdGVtKTtcbiAgICAgIH07XG5cbiAgICAgIGxpc3RDdHJsLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgXy5wdWxsKCRzY29wZS5pdGVtcywgaXRlbSk7XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KXtcbiAgICAgICRzY29wZS5uZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCduZ01vZGVsICYmICggISBuZ01vZGVsLiRtb2RlbFZhbHVlKSAmJiBhdXRvc2VsZWN0ICYmIGl0ZW1zJywgZnVuY3Rpb24oaXRlbXMpe1xuICAgICAgICBpZiAoaXRlbXMpe1xuICAgICAgICAgICRzY29wZS5uZ01vZGVsLiRzZXRWaWV3VmFsdWUoaXRlbXNbT2JqZWN0LmtleXMoaXRlbXMpWzBdXSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy1tb2RhbCAubW9kYWx7ZGlzcGxheTogYmxvY2t9JyxcblxuICAgIC8vb3B0aW9uYWwgZnVsbC1oZWlnaHQgc3R5bGVzXG4gICAgLy9UT0RPOiBjb25zaWRlciBpbnRyb2R1Y2luZyBuZXcgZWxlbWVudFxuICAgIC8vVE9ETzogY29uc2lkZXIgcmVsYXRpb24gdG8gb3ZlcmxheVxuICAgIC8vXG4gICAgLy8gbnctbW9kYWwgLm1vZGFsLWNvbnRlbnR7Ym9yZGVyLXJhZGl1czogMDsgYm9yZGVyOiAwOyBoZWlnaHQ6IDEwMCV9XG4gICAgLy8gbnctbW9kYWwgLm1vZGFsLWRpYWxvZ3twb3NpdGlvbjogZml4ZWQ7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IG1hcmdpbjogMDsgdG9wOiAwOyBsZWZ0OiAwfVxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cIm1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj48ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiIG5nLXNob3c9XCIgbmFtZSBcIj48aDMgY2xhc3M9XCJtb2RhbC10aXRsZVwiPnt7IG5hbWUgfX08L2gzPjwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCIgbmctc2hvdz1cIiBmb290ZXIgXCI+e3sgZm9vdGVyIH19PC9kaXY+JyArXG4gICAgICAnPC9kaXY+PC9kaXY+PC9kaXY+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIGZvb3RlcjogJydcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxuYXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLXt7IHR5cGUgfX0ge3sgbmF2YmFyQ2xhc3MgfX1cIiByb2xlPVwibmF2aWdhdGlvblwiPicgK1xuICAgICAgJyAgPGEgaHJlZj1cIlwiIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgbmctc2hvdz1cIiBuYW1lIFwiPnt7IG5hbWUgfX08L2E+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9uYXY+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHR5cGU6ICdkZWZhdWx0JyxcbiAgICAgIG5hdmJhckNsYXNzOiAnJ1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLXt7IHR5cGUgfX1cIj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgbmctc2hvdz1cIiBuYW1lIFwiPnt7IG5hbWUgfX08L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+JyArXG4gICAgICAnICAgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAgICcgIDwvZGl2PicgK1xuICAgICAgJzwvZGl2PicsXG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgbmFtZTogJycsXG4gICAgICB0eXBlOiAnZGVmYXVsdCdcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vVE9ETzogY29uc2lkZXIgcmVuYW1pbmcgdG8gPG53LXNlY3Rpb25cbi8vICAoaW50cm9kdWNlICYgc3VwcG9ydCBhY2NvcmRpb24pXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICByZXF1aXJlOiBbJ15ud1RhYnMnXSxcblxuICAgIHRlbXBsYXRlOiAnPGNvbnRlbnQgbmctc2hvdz1cIiBhY3RpdmUgXCI+PC9jb250ZW50PicsXG5cbiAgICBkZWZhdWx0czoge1xuICAgICAgbmFtZTogJydcbiAgICB9LFxuXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBjdHJscyl7XG4gICAgICB2YXJcbiAgICAgICAgdGFic0N0cmwgPSBjdHJsc1swXVxuICAgICAgO1xuXG4gICAgICB0YWJzQ3RybC5hZGRUYWIoJHNjb3BlKTtcblxuICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB0YWJzQ3RybC5yZW1vdmVUYWIuYmluZCh0YWJzQ3RybCwgJHNjb3BlKSk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcbiAgXyA9IHJlcXVpcmUoJy4uL3V0aWxzL3V0aWxzJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy10YWJzIG53LWxpc3R7ZGlzcGxheTogYmxvY2s7IG1hcmdpbi1ib3R0b206IDFlbX0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPG53LWxpc3QgaXRlbXM9XCIgdGFicyBcIiBsaXN0LWNsYXNzPVwibmF2IG5hdi10YWJzXCIgbmctbW9kZWw9XCIgYWN0aXZlVGFiIFwiPjwvbnctbGlzdD4nICtcbiAgICAgICc8Y29udGVudD48L2NvbnRlbnQ+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICB0YWJzOiBbXSxcbiAgICAgIGFjdGl2ZVRhYjogbnVsbFxuICAgIH0sXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgdmFyXG4gICAgICAgIHRhYnNDdHJsID0gdGhpc1xuICAgICAgO1xuXG4gICAgICB0YWJzQ3RybC5hZGRUYWIgPSBmdW5jdGlvbih0YWIpe1xuICAgICAgICAkc2NvcGUudGFicy5wdXNoKHRhYik7XG4gICAgICB9O1xuXG4gICAgICB0YWJzQ3RybC5yZW1vdmVUYWIgPSBmdW5jdGlvbih0YWIpe1xuICAgICAgICBfLnB1bGwoJHNjb3BlLnRhYnMsIHRhYik7XG4gICAgICB9O1xuXG4gICAgICAvL1RPRE86IGF1dG9zZWxlY3RcbiAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCd0YWJzJywgZnVuY3Rpb24odGFicyl7XG4gICAgICAgICRzY29wZS5hY3RpdmVUYWIgPSAkc2NvcGUuYWN0aXZlVGFiIHx8IHRhYnNbMF07XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLiR3YXRjaCgnYWN0aXZlVGFiJywgZnVuY3Rpb24oYWN0aXZlVGFiKXtcbiAgICAgICAgJHNjb3BlLnRhYnMuZm9yRWFjaChmdW5jdGlvbih0YWIpe1xuICAgICAgICAgIHRhYi5hY3RpdmUgPSAodGFiID09PSBhY3RpdmVUYWIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8bnctYnRuIGljb249XCJ0cmFzaC1vXCIgbmctY2xpY2s9XCIgcmVjb3JkLiRkZWxldGUoKSBcIj48L253LWJ0bj4nLFxuXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIHJlY29yZDoge31cbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgICAnICA8bGFiZWwgbmctc2hvdz1cIiBsYWJlbCBcIiBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj57eyBsYWJlbCB9fTwvbGFiZWw+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIGNvbnRyb2wgPSAkZWxlbWVudC5maW5kKCd0ZXh0YXJlYSwgc2VsZWN0LCBpbnB1dDpub3QoW3R5cGU9XCJyYWRpb1wiXSk6bm90KFt0eXBlPVwiY2hlY2tib3hcIl0pJyk7XG5cbiAgICAgICRzY29wZS5uZ01vZGVsID0gY29udHJvbC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIGNvbnRyb2wuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8bnctYnRuIGljb249XCJzYXZlXCIgbmctY2xpY2s9XCIgcmVjb3JkLiRzYXZlKCkgXCI+PC9udy1idG4+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICByZWNvcmQ6IHt9XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkdHJhbnNjbHVkZSl7XG4gICAgICAkdHJhbnNjbHVkZSgkc2NvcGUuJGhvc3QsICRlbGVtZW50LmFwcGVuZC5iaW5kKCRlbGVtZW50KSk7XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vVE9ETzogdGVzdFxudHJ5e1xuICB2YXJcbiAgICBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICAgIHNob3dkb3duID0gcmVxdWlyZSgnc2hvd2Rvd24nKSxcbiAgICBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uY29udmVydGVyKCksXG4gICAgbWFrZUh0bWwgPSBjb252ZXJ0ZXIubWFrZUh0bWwuYmluZChjb252ZXJ0ZXIpXG4gIDtcbn0gY2F0Y2goZSl7XG4gIG1ha2VIdG1sID0gYW5ndWxhci5pZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NlLCAkbG9nKXtcbiAgaWYgKCAhIHNob3dkb3duKXtcbiAgICAkbG9nLmVycm9yKCdTaG93ZG93biBsaWJyYXJ5IG5vdCBhdmFpbGFibGUuJyk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oc291cmNlKXtcbiAgICByZXR1cm4gc291cmNlICYmICRzY2UudHJ1c3RBc0h0bWwobWFrZUh0bWwoZml4RW1haWwoc291cmNlKSkpO1xuICB9O1xufTtcblxuZnVuY3Rpb24gZml4RW1haWwobWFya2Rvd24pe1xuICByZXR1cm4gbWFya2Rvd24ucmVwbGFjZSgvPChcXHcrXFxAXFx3K1xcLlxcdyspPi9nLCAnPGEgaHJlZj1cIm1haWx0bzokMVwiPiQxPC9hPicpO1xufSIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oyd1c2Ugc3RyaWN0JztcblxudmFyXG4gIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBXaWRnZXREZWZpbml0aW9uO1xuXG5mdW5jdGlvbiBXaWRnZXREZWZpbml0aW9uKGNmZyl7XG4gIGlmICgodGhpcyA9PT0gZ2xvYmFsKSB8fCAodGhpcyA9PT0gdW5kZWZpbmVkKSl7XG4gICAgcmV0dXJuIG5ldyBXaWRnZXREZWZpbml0aW9uKGNmZyk7XG4gIH1cblxuICBhbmd1bGFyLmV4dGVuZCh0aGlzLCBjZmcpO1xufVxuXG5XaWRnZXREZWZpbml0aW9uLnByb3RvdHlwZSA9IHtcbiAgcmVzdHJpY3Q6ICdFJyxcbiAgdGVtcGxhdGU6ICcnLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICBzY29wZToge30sXG4gIGRlZmF1bHRzOiB7fSxcblxuICAvL2FjdHVhbCBzdHVmZlxuICBjb21waWxlOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICBwcmU6IHRoaXMucHJlbGluay5iaW5kKHRoaXMpLFxuICAgICAgcG9zdDogdGhpcy5saW5rICYmIHRoaXMubGluay5iaW5kKHRoaXMpXG4gICAgfTtcbiAgfSxcblxuICBwcmVsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpe1xuICAgICRzY29wZS4kaG9zdCA9ICRzY29wZS4kcGFyZW50O1xuICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZSwgYW5ndWxhci5jb3B5KHRoaXMuZGVmYXVsdHMpKTtcblxuICAgIGJpbmRBdHRyaWJ1dGVzKCRzY29wZSwgJGF0dHJzLCB0aGlzLmRlZmF1bHRzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYmluZEF0dHJpYnV0ZXMoJHNjb3BlLCAkYXR0cnMsIGRlZmF1bHRzKXtcbiAgZm9yICh2YXIgayBpbiAkYXR0cnMuJGF0dHIpe1xuICAgICRzY29wZVtrXSA9ICRhdHRyc1trXTtcblxuICAgIC8vVE9ETzogdGVzdCAocGFydGlhbGx5IGNvdmVyZWQgYnkgbnctKiB3aWRnZXRzKVxuICAgIC8vbW9zdCB3YW50ZWRcbiAgICBpZiAoZGVmYXVsdHNba10gaW5zdGFuY2VvZiBPYmplY3Qpe1xuICAgICAgJHNjb3BlW2tdID0gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzW2tdKTtcbiAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaENvbGxlY3Rpb24oJGF0dHJzW2tdLCBkb3RTZXQoJHNjb3BlLCBrKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvL2Jvb2xlYW4gZXhwcmVzc2lvbnNcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRzW2tdID09PSAnYm9vbGVhbicpe1xuICAgICAgJHNjb3BlW2tdID0gJHNjb3BlLiRwYXJlbnQuJGV2YWwoJGF0dHJzW2tdKTtcbiAgICAgICRzY29wZS4kcGFyZW50LiR3YXRjaCgkYXR0cnNba10sIGRvdFNldCgkc2NvcGUsIGspKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vc3RyaW5nIGludGVycG9sYXRpb25cbiAgICBpZiAoJGF0dHJzLiQkb2JzZXJ2ZXJzICYmICRhdHRycy4kJG9ic2VydmVyc1trXSl7XG4gICAgICAkYXR0cnMuJG9ic2VydmUoaywgZG90U2V0KCRzY29wZSwgaykpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb3RTZXQob2JqLCBwcm9wKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgb2JqW3Byb3BdID0gdmFsO1xuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6ICc8cD57eyBsaXBzdW0gfX08L3A+JyxcblxuICAgIGRlZmF1bHRzOiB7XG4gICAgICBsaXBzdW06ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLidcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgdmFyIHJlcyA9IFtdO1xuXG4gIFtdLmZvckVhY2guY2FsbCh0aGlzLCBmdW5jdGlvbihlbCl7XG4gICAgcmVzLnB1c2guYXBwbHkocmVzLCBbXS5zbGljZS5jYWxsKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKSk7XG4gIH0pO1xuXG4gIHJldHVybiBhbmd1bGFyLmVsZW1lbnQocmVzKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHVsbDogZnVuY3Rpb24oYXJyLCBpdGVtKXtcbiAgICB2YXIgaWR4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG5cbiAgICByZXR1cm4gKH5pZHgpICYmIGFyci5zcGxpY2UoaWR4LCAxKTtcbiAgfVxufTsiXX0=
