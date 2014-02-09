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
  angular.element.prototype.find = require('./src/qsa.js');
}

ngWidgets
  .value('ngWidget', require('./src/ngWidget.js'))

  .filter('markdown', require('./src/markdown.js'))

  .directive('content', require('./src/content'))
  .directive('nwBtn', require('./src/nw-btn'))
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
},{"./src/content":4,"./src/markdown.js":5,"./src/ngWidget.js":6,"./src/nw-btn":7,"./src/nw-field":8,"./src/nw-grid":10,"./src/nw-grid-col":9,"./src/nw-lipsum":11,"./src/nw-list":12,"./src/nw-modal":13,"./src/nw-panel":14,"./src/nw-row":15,"./src/nw-tab":16,"./src/nw-tabs":17,"./src/qsa.js":18,"angular":2}],2:[function(require,module,exports){
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
    return source && $sce.trustAsHtml(makeHtml(source));
  };
};
},{"angular":2,"showdown":3}],6:[function(require,module,exports){
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
},{"angular":2}],7:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<a class="btn btn-{{ type }}"><content></content></a>',

    defaults: {
      type: 'default'
    }
  });
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
      items: [],
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

      //TODO: this is nasty, would be much better to get all hostElement scopes in array
      angular.forEach(colEls, function(colEl){
        $scope.cols.push(angular.element(colEl).isolateScope());
      });

      //init repeater
      tr.attr('ng-repeat', ' it in items | orderBy:sortCol.index:reverse ');

      $scope.cols.forEach(function(col){
        trHtml += '<td>' + col.template() + '</td>';
      });

      //TODO: find better way to compile new elements in link phase
      $element.injector().get('$compile')(tr.html(trHtml))($scope);
    }
  });
};
},{"angular":2}],11:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<p>{{ lipsum }}</p>',

    defaults: {
      lipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  });
};
},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items " class="{{ listClass }}">' +
      '  <li ng-repeat=" it in items " ng-class="{ {{ activeClass }}: it == ngModel.$modelValue }">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items ">{{ emptyText }}</p>',

    defaults: {
      items: [],
      emptyText: 'No items found',
      activeClass: 'active'
    },

    link: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //if ('autoselect' in $scope){
      //
      //}
    }
  });
};
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>',
    link: function($scope, $element, $attrs){
      $element.find('.row > content').children().addClass($attrs.itemClass);
    }
  });
};
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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