(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.css">
// <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">

// <div ng-app>
// <h1 class="page-header">ngWidgets</h1>
// <p class="lead">Collection of reusable angularjs widgets</p>

// <iframe src="http://ghbtns.com/github-btn.html?user=cztomsik&amp;repo=ngWidgets&amp;type=watch&amp;count=true&amp;size=large" allowtransparency="true" frameborder="0" scrolling="0" width="170" height="30"></iframe>

// <br><br>

// <h2>Quickstart</h2>
// <ul>
//   <li>include <code>&lt;script src="ngWidgets.js"</code></li>
//   <li>define angularjs dependency <code>ngWidgets</code></li>
// </ul>

// <h2 class="page-header">&lt;nw-list</h2>
// <nw-list items=" users " ng-model=" user " list-class=" nav " active-class=" open " autoselect></nw-list>

// <h2 class="page-header">&lt;nw-field</h2>
// <nw-field label="Name">
//   <input ng-model=" user.name " required>
// </nw-field>
// <nw-field label="Email">
//   <input type="email" ng-model=" user.email " required>
// </nw-field>

// <h2 class="page-header">&lt;nw-panel</h2>
// <nw-panel heading="User data {{ user.name }}">
//   {{ user || 'Please select user' }}
// </nw-panel>

// <h2 class="page-header">&lt;nw-tabs</h2>
// <nw-tabs>
//   <nw-tab name="First">Content: First</nw-tab>
//   <nw-tab name="Second">Content: Second</nw-tab>
// </nw-tabs>
// </div>

// <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script>
// <script src="../ngWidgets.js"></script>
// <script>
//   function Docs($scope){
//     $scope.users = [
//       {name: 'Admin', email: 'admin@site.com'},
//       {name: 'User', email: 'user@site.com'}
//     ];
//   }

//   angular
//     .module('docs', ['ngWidgets'])
//   ;
// </script>

/* global angular */
angular
  .module('ngWidgets', [])

  .value('ngWidget', require('./src/ngWidget.js'))

  .directive('content', require('./src/content'))
  .directive('nwList', require('./src/nw-list'))
  .directive('nwField', require('./src/nw-field'))
  .directive('nwPanel', require('./src/nw-panel'))

  .directive('nwGrid', require('./src/nw-grid'))
  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
  .directive('nwTab', require('./src/nw-tab'))
;
},{"./src/content":2,"./src/ngWidget.js":3,"./src/nw-field":4,"./src/nw-grid":6,"./src/nw-grid-col":5,"./src/nw-list":7,"./src/nw-panel":8,"./src/nw-tab":9,"./src/nw-tabs":10}],2:[function(require,module,exports){
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

/* global angular */
module.exports = function(widgetDef){
  //TODO: make it overridable (timeout?)
  if (widgetDef.style){
    angular.element(document.body).append(angular.element('<style></style>').html(widgetDef.style));
  }

  //TODO: publish widgetDef itself under SOME name (directives can be injected, so we can override defaults)
  return {
    restrict: 'E',
    template: widgetDef.template || '',
    transclude: true,
    scope: {},
    controller: widgetCtrl(widgetDef)
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    name: '',
    index: '',
    type: 'static',

    init: function($scope, $element, $transclude){
      //copy contents (TODO: $host)
      var tmp = $element.clone().html('');
      $transclude(this, tmp.append.bind(tmp));

      this.html = tmp.find('template').html();

      this.$parent.cols.push(this);
    },

    template: function(){
      return this.html || ('{{ it["' + this.index + '"] }}');
    }
  });
};
},{}],6:[function(require,module,exports){
'use strict';

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

    // # <nw-grid
    //     <nw-grid items=" users " ng-model=" user ">
    //       <nw-grid-col name="Name" index=" name "></nw-grid-col>
    //       <nw-grid-col name="Actions">
    //         <template>
    //           <a href="{{ it.editUrl }}">Edit</a>
    //         </template>
    //       </nw-grid-col>
    //     </nw-grid>
    template:
      '<table class="table table-striped table-hover table-bordered">' +
      '  <thead>' +
      '    <tr>' +
      '    <th' +
      '      ng-repeat=" col in cols " ' +
      '      ng-class=" {active: col.index == sortIndex} " ' +
      '      ng-click=" $parent.reverse = ((col.index == sortIndex) && !reverse); $parent.sortIndex = col.index " ' +
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

    items: [],
    cols: [],
    sortIndex: null,
    reverse: false,
    autosort: true,

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
        if ($scope.autosort){
          $scope.sortIndex = $scope.sortIndex || $scope.cols[0].index;
        }

        //init repeater
        tr.attr('ng-repeat', ' it in items | orderBy:sortIndex:reverse ');

        $scope.cols.forEach(function(col){
          trHtml += '<td>' + col.template() + '</td>';
        });

        $compile(tr.html(trHtml))($scope);
      });
    }
  });
};
},{}],7:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items " class="{{listClass}}">' +
      '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
      '    <a href="" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
      '  </li>' +
      '</ul>' +
      '<p ng-hide=" items " class="empty-text">{{ emptyText }}</p>',

    items: [],
    emptyText: '',
    listClass: 'list-unstyled',
    activeClass: 'active',

    autoselect: false,

    init: function($scope, $element){
      $scope.ngModel = $element.controller('ngModel');

      //TODO: mixin?
      $scope.$watch('autoselect && items && ( ! ngModel.$modelValue)', function(result){
        return result && $scope.ngModel.$setViewValue($scope.firstItem());
      });
    },

    firstItem: function(){
      return this.items[ Object.keys(this.items)[0] ];
    }
  });
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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