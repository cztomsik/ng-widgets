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

    items: [],
    cols: [],
    sortCol: null,
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
          $scope.sortCol = $scope.sortCol || $scope.cols[0];
        }

        //init repeater
        tr.attr('ng-repeat', ' it in items | orderBy:sortCol.index:reverse ');

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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvY29udGVudC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9uZ1dpZGdldC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1maWVsZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1ncmlkLWNvbC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1ncmlkLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LWxpc3QuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctcGFuZWwuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctdGFiLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXRhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLy8gPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIvL25ldGRuYS5ib290c3RyYXBjZG4uY29tL2Jvb3RzdHJhcC8zLjAuMi9jc3MvYm9vdHN0cmFwLmNzc1wiPlxuLy8gPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIvL25ldGRuYS5ib290c3RyYXBjZG4uY29tL2ZvbnQtYXdlc29tZS80LjAuMy9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3NcIj5cblxuLy8gPGRpdiBuZy1hcHA+XG4vLyA8aDEgY2xhc3M9XCJwYWdlLWhlYWRlclwiPm5nV2lkZ2V0czwvaDE+XG4vLyA8cCBjbGFzcz1cImxlYWRcIj5Db2xsZWN0aW9uIG9mIHJldXNhYmxlIGFuZ3VsYXJqcyB3aWRnZXRzPC9wPlxuXG4vLyA8aWZyYW1lIHNyYz1cImh0dHA6Ly9naGJ0bnMuY29tL2dpdGh1Yi1idG4uaHRtbD91c2VyPWN6dG9tc2lrJmFtcDtyZXBvPW5nV2lkZ2V0cyZhbXA7dHlwZT13YXRjaCZhbXA7Y291bnQ9dHJ1ZSZhbXA7c2l6ZT1sYXJnZVwiIGFsbG93dHJhbnNwYXJlbmN5PVwidHJ1ZVwiIGZyYW1lYm9yZGVyPVwiMFwiIHNjcm9sbGluZz1cIjBcIiB3aWR0aD1cIjE3MFwiIGhlaWdodD1cIjMwXCI+PC9pZnJhbWU+XG5cbi8vIDxicj48YnI+XG5cbi8vIDxoMj5RdWlja3N0YXJ0PC9oMj5cbi8vIDx1bD5cbi8vICAgPGxpPmluY2x1ZGUgPGNvZGU+Jmx0O3NjcmlwdCBzcmM9XCJuZ1dpZGdldHMuanNcIjwvY29kZT48L2xpPlxuLy8gICA8bGk+ZGVmaW5lIGFuZ3VsYXJqcyBkZXBlbmRlbmN5IDxjb2RlPm5nV2lkZ2V0czwvY29kZT48L2xpPlxuLy8gPC91bD5cblxuLy8gPGgyIGNsYXNzPVwicGFnZS1oZWFkZXJcIj4mbHQ7bnctbGlzdDwvaDI+XG4vLyA8bnctbGlzdCBpdGVtcz1cIiB1c2VycyBcIiBuZy1tb2RlbD1cIiB1c2VyIFwiIGxpc3QtY2xhc3M9XCIgbmF2IFwiIGFjdGl2ZS1jbGFzcz1cIiBvcGVuIFwiIGF1dG9zZWxlY3Q+PC9udy1saXN0PlxuXG4vLyA8aDIgY2xhc3M9XCJwYWdlLWhlYWRlclwiPiZsdDtudy1maWVsZDwvaDI+XG4vLyA8bnctZmllbGQgbGFiZWw9XCJOYW1lXCI+XG4vLyAgIDxpbnB1dCBuZy1tb2RlbD1cIiB1c2VyLm5hbWUgXCIgcmVxdWlyZWQ+XG4vLyA8L253LWZpZWxkPlxuLy8gPG53LWZpZWxkIGxhYmVsPVwiRW1haWxcIj5cbi8vICAgPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5nLW1vZGVsPVwiIHVzZXIuZW1haWwgXCIgcmVxdWlyZWQ+XG4vLyA8L253LWZpZWxkPlxuXG4vLyA8aDIgY2xhc3M9XCJwYWdlLWhlYWRlclwiPiZsdDtudy1wYW5lbDwvaDI+XG4vLyA8bnctcGFuZWwgaGVhZGluZz1cIlVzZXIgZGF0YSB7eyB1c2VyLm5hbWUgfX1cIj5cbi8vICAge3sgdXNlciB8fCAnUGxlYXNlIHNlbGVjdCB1c2VyJyB9fVxuLy8gPC9udy1wYW5lbD5cblxuLy8gPGgyIGNsYXNzPVwicGFnZS1oZWFkZXJcIj4mbHQ7bnctdGFiczwvaDI+XG4vLyA8bnctdGFicz5cbi8vICAgPG53LXRhYiBuYW1lPVwiRmlyc3RcIj5Db250ZW50OiBGaXJzdDwvbnctdGFiPlxuLy8gICA8bnctdGFiIG5hbWU9XCJTZWNvbmRcIj5Db250ZW50OiBTZWNvbmQ8L253LXRhYj5cbi8vIDwvbnctdGFicz5cbi8vIDwvZGl2PlxuXG4vLyA8c2NyaXB0IHNyYz1cIi8vYWpheC5nb29nbGVhcGlzLmNvbS9hamF4L2xpYnMvYW5ndWxhcmpzLzEuMi44L2FuZ3VsYXIubWluLmpzXCI+PC9zY3JpcHQ+XG4vLyA8c2NyaXB0IHNyYz1cIi4uL25nV2lkZ2V0cy5qc1wiPjwvc2NyaXB0PlxuLy8gPHNjcmlwdD5cbi8vICAgZnVuY3Rpb24gRG9jcygkc2NvcGUpe1xuLy8gICAgICRzY29wZS51c2VycyA9IFtcbi8vICAgICAgIHtuYW1lOiAnQWRtaW4nLCBlbWFpbDogJ2FkbWluQHNpdGUuY29tJ30sXG4vLyAgICAgICB7bmFtZTogJ1VzZXInLCBlbWFpbDogJ3VzZXJAc2l0ZS5jb20nfVxuLy8gICAgIF07XG4vLyAgIH1cblxuLy8gICBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnZG9jcycsIFsnbmdXaWRnZXRzJ10pXG4vLyAgIDtcbi8vIDwvc2NyaXB0PlxuXG4vKiBnbG9iYWwgYW5ndWxhciAqL1xuYW5ndWxhclxuICAubW9kdWxlKCduZ1dpZGdldHMnLCBbXSlcblxuICAudmFsdWUoJ25nV2lkZ2V0JywgcmVxdWlyZSgnLi9zcmMvbmdXaWRnZXQuanMnKSlcblxuICAuZGlyZWN0aXZlKCdjb250ZW50JywgcmVxdWlyZSgnLi9zcmMvY29udGVudCcpKVxuICAuZGlyZWN0aXZlKCdud0xpc3QnLCByZXF1aXJlKCcuL3NyYy9udy1saXN0JykpXG4gIC5kaXJlY3RpdmUoJ253RmllbGQnLCByZXF1aXJlKCcuL3NyYy9udy1maWVsZCcpKVxuICAuZGlyZWN0aXZlKCdud1BhbmVsJywgcmVxdWlyZSgnLi9zcmMvbnctcGFuZWwnKSlcblxuICAuZGlyZWN0aXZlKCdud0dyaWQnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkJykpXG4gIC5kaXJlY3RpdmUoJ253R3JpZENvbCcsIHJlcXVpcmUoJy4vc3JjL253LWdyaWQtY29sJykpXG5cbiAgLmRpcmVjdGl2ZSgnbndUYWJzJywgcmVxdWlyZSgnLi9zcmMvbnctdGFicycpKVxuICAuZGlyZWN0aXZlKCdud1RhYicsIHJlcXVpcmUoJy4vc3JjL253LXRhYicpKVxuOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJHRyYW5zY2x1ZGUpe1xuICAgICAgJHRyYW5zY2x1ZGUoJHNjb3BlLiRwYXJlbnQsICRlbGVtZW50LmFwcGVuZC5iaW5kKCRlbGVtZW50KSk7XG4gICAgfVxuICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCBhbmd1bGFyICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZGdldERlZil7XG4gIC8vVE9ETzogbWFrZSBpdCBvdmVycmlkYWJsZSAodGltZW91dD8pXG4gIGlmICh3aWRnZXREZWYuc3R5bGUpe1xuICAgIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoYW5ndWxhci5lbGVtZW50KCc8c3R5bGU+PC9zdHlsZT4nKS5odG1sKHdpZGdldERlZi5zdHlsZSkpO1xuICB9XG5cbiAgLy9UT0RPOiBwdWJsaXNoIHdpZGdldERlZiBpdHNlbGYgdW5kZXIgU09NRSBuYW1lIChkaXJlY3RpdmVzIGNhbiBiZSBpbmplY3RlZCwgc28gd2UgY2FuIG92ZXJyaWRlIGRlZmF1bHRzKVxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgdGVtcGxhdGU6IHdpZGdldERlZi50ZW1wbGF0ZSB8fCAnJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHNjb3BlOiB7fSxcbiAgICBjb250cm9sbGVyOiB3aWRnZXRDdHJsKHdpZGdldERlZilcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHdpZGdldEN0cmwod2lkZ2V0RGVmKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRpbmplY3Rvcil7XG4gICAgYW5ndWxhci5leHRlbmQoJHNjb3BlLCB3aWRnZXREZWYpO1xuXG4gICAgc2V0dXBXYXRjaGVzKCRzY29wZSwgJGF0dHJzLCB3aWRnZXREZWYpO1xuXG4gICAgaWYgKCRzY29wZS5pbml0KXtcbiAgICAgICRzY29wZS4kJHBvc3REaWdlc3QoZnVuY3Rpb24oKXtcbiAgICAgICAgJGluamVjdG9yLmludm9rZSgkc2NvcGUuaW5pdCwgJHNjb3BlLCB7JGVsZW1lbnQ6ICRlbGVtZW50LCAkYXR0cnM6ICRhdHRycywgJHNjb3BlOiAkc2NvcGUsICR0cmFuc2NsdWRlOiAkdHJhbnNjbHVkZX0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBzZXR1cFdhdGNoZXMoJHNjb3BlLCAkYXR0cnMsIHdpZGdldERlZil7XG4gIC8vVE9ETzogaW5jbHVkZSBwcm90b3R5cGUgY2hhaW5cbiAgT2JqZWN0LmtleXMod2lkZ2V0RGVmKS5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgIC8vcHJlc2VydmUgZGVmYXVsdHNcbiAgICBpZiAoJGF0dHJzW2tdID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vdHdvLXdheSBib3VuZCBiZWNhdXNlIG9mIG9iamVjdCByZWZlcmVuY2VzXG4gICAgaWYgKGFuZ3VsYXIuaXNPYmplY3Qod2lkZ2V0RGVmW2tdKSl7XG5cbiAgICAgIC8vc3BlY2lhbCBjYXNlIGFycmF5LWxpa2VcbiAgICAgIGlmICgnbGVuZ3RoJyBpbiB3aWRnZXREZWZba10pe1xuICAgICAgICByZXR1cm4gJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oJyRwYXJlbnQuJyArICRhdHRyc1trXSwgZnVuY3Rpb24oY29sbCl7XG4gICAgICAgICAgJHNjb3BlW2tdID0gY29sbDtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAkc2NvcGUuJHdhdGNoKCckcGFyZW50LicgKyAkYXR0cnNba10sIGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICRzY29wZVtrXSA9IHZhbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vb25lLXdheSBib29sZWFuXG4gICAgaWYgKHR5cGVvZiB3aWRnZXREZWZba10gPT09ICdib29sZWFuJyl7XG5cbiAgICAgIC8vc3RhdGljIGJpbmFyeSBhdHRyaWJ1dGUgKGF1dG9mb2N1cywgZXRjLilcbiAgICAgIGlmICgkYXR0cnNba10gPT09ICcnKXtcbiAgICAgICAgJHNjb3BlW2tdID0gaztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvL2V4cHJlc3Npb24gb3RoZXJ3aXNlXG4gICAgICByZXR1cm4gJHNjb3BlLiR3YXRjaCgnJHBhcmVudC4nICsgJGF0dHJzW2tdLCBmdW5jdGlvbih2YWwpe1xuICAgICAgICAkc2NvcGVba10gPSAoISEgdmFsKSAmJiBrO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9vbmUtd2F5IG51bWJlclxuICAgIGlmIChhbmd1bGFyLmlzTnVtYmVyKHdpZGdldERlZltrXSkpe1xuICAgICAgcmV0dXJuICRhdHRycy4kb2JzZXJ2ZShrLCBmdW5jdGlvbih2YWwpe1xuICAgICAgICAkc2NvcGVba10gPSArdmFsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9vbmUtd2F5XG4gICAgJGF0dHJzLiRvYnNlcnZlKGssIGZ1bmN0aW9uKHZhbCl7XG4gICAgICAkc2NvcGVba10gPSB2YWw7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwiIHtcXCdoYXMtZXJyb3JcXCc6IG5nTW9kZWwuJGRpcnR5ICYmIG5nTW9kZWwuJGludmFsaWR9IFwiPicgK1xuICAgICAgJyAgPGxhYmVsIG5nLXNob3c9XCIgbGFiZWwgXCIgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+e3sgbGFiZWwgfX08L2xhYmVsPicgK1xuICAgICAgJyAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuXG4gICAgICAnICA8cCBjbGFzcz1cImhlbHAtYmxvY2tcIj4nICtcbiAgICAgICcgICAge3sgaGVscCB9fScgK1xuICAgICAgJyAgPC9wPicgK1xuXG4gICAgICAnICA8dWwgY2xhc3M9XCJoZWxwLWJsb2NrXCIgbmctc2hvdz1cIiBuZ01vZGVsLiRkaXJ0eSBcIiBzdHlsZT1cIiBmb250LXdlaWdodDogYm9sZCBcIj4nICtcbiAgICAgICcgICAgPGxpIG5nLXJlcGVhdD1cIiAoaywgZSkgaW4gbmdNb2RlbC4kZXJyb3IgXCIgbmctc2hvdz1cIiBlIFwiPlRoaXMgZmllbGQgaXMge3sgayB9fTwvbGk+JyArXG4gICAgICAnICA8L3VsPicgK1xuICAgICAgJzwvZGl2PicsXG5cbiAgICBsYWJlbDogJycsXG4gICAgaGVscDogJycsXG5cbiAgICBpbml0OiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkdGltZW91dCl7XG4gICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubmdNb2RlbCA9ICRlbGVtZW50LmZpbmQoJ2NvbnRlbnQnKS5jaGlsZHJlbigpLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wnKS5jb250cm9sbGVyKCduZ01vZGVsJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIG5hbWU6ICcnLFxuICAgIGluZGV4OiAnJyxcbiAgICB0eXBlOiAnc3RhdGljJyxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICR0cmFuc2NsdWRlKXtcbiAgICAgIC8vY29weSBjb250ZW50cyAoVE9ETzogJGhvc3QpXG4gICAgICB2YXIgdG1wID0gJGVsZW1lbnQuY2xvbmUoKS5odG1sKCcnKTtcbiAgICAgICR0cmFuc2NsdWRlKHRoaXMsIHRtcC5hcHBlbmQuYmluZCh0bXApKTtcblxuICAgICAgdGhpcy5odG1sID0gdG1wLmZpbmQoJ3RlbXBsYXRlJykuaHRtbCgpO1xuXG4gICAgICB0aGlzLiRwYXJlbnQuY29scy5wdXNoKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0ZW1wbGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLmh0bWwgfHwgKCd7eyBpdFtcIicgKyB0aGlzLmluZGV4ICsgJ1wiXSB9fScpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6XG4gICAgICAvL2hhbmQgKyB1bnNlbGVjdGFibGVcbiAgICAgICdudy1ncmlkIHRoZWFkIHRoe2N1cnNvcjogcG9pbnRlcjsgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7IC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7IC1tcy11c2VyLXNlbGVjdDogbm9uZTsgdXNlci1zZWxlY3Q6IG5vbmV9JyArXG4gICAgICAnbnctZ3JpZFtuZy1tb2RlbF0gdGJvZHkgdHJ7Y3Vyc29yOiBwb2ludGVyfScgK1xuXG4gICAgICAvL2NhcnJldCB2aXNpYmlsaXR5XG4gICAgICAnbnctZ3JpZCB0aCBpLmZhe3Zpc2liaWxpdHk6IGhpZGRlbn0nICtcbiAgICAgICdudy1ncmlkIHRoLmFjdGl2ZSBpLmZhe3Zpc2liaWxpdHk6IHZpc2libGV9JyArXG5cbiAgICAgIC8vYm9vdHN0cmFwIGJ1Zz8gc3RyaXBlZCArIGhvdmVyICsgYWN0aXZlXG4gICAgICAnbnctZ3JpZCB0ci5hY3RpdmUgdGR7YmFja2dyb3VuZDogIzY4YyAhaW1wb3J0YW50OyBjb2xvcjogI2ZmZiAhaW1wb3J0YW50fScsXG5cbiAgICAvLyAjIDxudy1ncmlkXG4gICAgLy8gICAgIDxudy1ncmlkIGl0ZW1zPVwiIHVzZXJzIFwiIG5nLW1vZGVsPVwiIHVzZXIgXCI+XG4gICAgLy8gICAgICAgPG53LWdyaWQtY29sIG5hbWU9XCJOYW1lXCIgaW5kZXg9XCIgbmFtZSBcIj48L253LWdyaWQtY29sPlxuICAgIC8vICAgICAgIDxudy1ncmlkLWNvbCBuYW1lPVwiQWN0aW9uc1wiPlxuICAgIC8vICAgICAgICAgPHRlbXBsYXRlPlxuICAgIC8vICAgICAgICAgICA8YSBocmVmPVwie3sgaXQuZWRpdFVybCB9fVwiPkVkaXQ8L2E+XG4gICAgLy8gICAgICAgICA8L3RlbXBsYXRlPlxuICAgIC8vICAgICAgIDwvbnctZ3JpZC1jb2w+XG4gICAgLy8gICAgIDwvbnctZ3JpZD5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLWhvdmVyIHRhYmxlLWJvcmRlcmVkXCI+JyArXG4gICAgICAnICA8dGhlYWQ+JyArXG4gICAgICAnICAgIDx0cj4nICtcbiAgICAgICcgICAgPHRoJyArXG4gICAgICAnICAgICAgbmctcmVwZWF0PVwiIGNvbCBpbiBjb2xzIFwiICcgK1xuICAgICAgJyAgICAgIG5nLWNsYXNzPVwiIHthY3RpdmU6IGNvbCA9PSBzb3J0Q29sfSBcIiAnICtcbiAgICAgICcgICAgICBuZy1jbGljaz1cIiAkcGFyZW50LnJldmVyc2UgPSAoKGNvbCA9PSBzb3J0Q29sKSAmJiAhcmV2ZXJzZSk7ICRwYXJlbnQuc29ydENvbCA9IGNvbCBcIiAnICtcbiAgICAgICcgICAgPicgK1xuICAgICAgJyAgICAgIHt7IGNvbC5uYW1lIH19ICcgK1xuICAgICAgJyAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY2FyZXQte3sgcmV2ZXJzZSA/XFwnZG93blxcJyA6XFwndXBcXCcgfX0gcHVsbC1yaWdodFwiPjwvaT4nICtcbiAgICAgICcgICAgPC90aD4nICtcbiAgICAgICcgICAgPC90cj4nICtcbiAgICAgICcgIDwvdGhlYWQ+JyArXG4gICAgICAnICA8dGJvZHk+JyArXG4gICAgICAnICAgIDx0cj48dGQ+VmFsdWU8L3RkPjwvdHI+JyArXG4gICAgICAnICA8L3Rib2R5PicgK1xuICAgICAgJzwvdGFibGU+JyxcblxuICAgIGl0ZW1zOiBbXSxcbiAgICBjb2xzOiBbXSxcbiAgICBzb3J0Q29sOiBudWxsLFxuICAgIHJldmVyc2U6IGZhbHNlLFxuICAgIGF1dG9zb3J0OiB0cnVlLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJHRpbWVvdXQsICRjb21waWxlLCAkdHJhbnNjbHVkZSl7XG4gICAgICB2YXJcbiAgICAgICAgdGJvZHkgPSAkZWxlbWVudC5maW5kKCd0Ym9keScpLFxuICAgICAgICB0ciA9IHRib2R5LmZpbmQoJ3RyJyksXG4gICAgICAgIHRySHRtbCA9ICcnXG4gICAgICA7XG5cbiAgICAgIC8vZG8gbm90IHNoYXJlXG4gICAgICAkc2NvcGUuY29scyA9IFtdO1xuXG4gICAgICAvL2luaXQgY29sc1xuICAgICAgJHRyYW5zY2x1ZGUodGhpcywgZnVuY3Rpb24oKXt9KTtcblxuICAgICAgLy9ncmlkLWNvbCBuYW1lcyBub3QgcmVzb2x2ZWQgeWV0IChUT0RPOiBpbnZva2UgY3RybCBhZnRlciBiaW5kaW5nIHNldHVwPylcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkc2NvcGUuYXV0b3NvcnQpe1xuICAgICAgICAgICRzY29wZS5zb3J0Q29sID0gJHNjb3BlLnNvcnRDb2wgfHwgJHNjb3BlLmNvbHNbMF07XG4gICAgICAgIH1cblxuICAgICAgICAvL2luaXQgcmVwZWF0ZXJcbiAgICAgICAgdHIuYXR0cignbmctcmVwZWF0JywgJyBpdCBpbiBpdGVtcyB8IG9yZGVyQnk6c29ydENvbC5pbmRleDpyZXZlcnNlICcpO1xuXG4gICAgICAgICRzY29wZS5jb2xzLmZvckVhY2goZnVuY3Rpb24oY29sKXtcbiAgICAgICAgICB0ckh0bWwgKz0gJzx0ZD4nICsgY29sLnRlbXBsYXRlKCkgKyAnPC90ZD4nO1xuICAgICAgICB9KTtcblxuICAgICAgICAkY29tcGlsZSh0ci5odG1sKHRySHRtbCkpKCRzY29wZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzx1bCBuZy1zaG93PVwiIGl0ZW1zIFwiIGNsYXNzPVwie3tsaXN0Q2xhc3N9fVwiPicgK1xuICAgICAgJyAgPGxpIG5nLXJlcGVhdD1cIiBpdCBpbiBpdGVtcyBcIiBuZy1jbGFzcz1cIiB7IHt7YWN0aXZlQ2xhc3N9fTogbmdNb2RlbC4kbW9kZWxWYWx1ZSA9PSBpdH0gXCI+JyArXG4gICAgICAnICAgIDxhIGhyZWY9XCJcIiBuZy1jbGljaz1cIiBuZ01vZGVsLiRzZXRWaWV3VmFsdWUoaXQpIFwiPnt7IGl0Lm5hbWUgfX08L2E+JyArXG4gICAgICAnICA8L2xpPicgK1xuICAgICAgJzwvdWw+JyArXG4gICAgICAnPHAgbmctaGlkZT1cIiBpdGVtcyBcIiBjbGFzcz1cImVtcHR5LXRleHRcIj57eyBlbXB0eVRleHQgfX08L3A+JyxcblxuICAgIGl0ZW1zOiBbXSxcbiAgICBlbXB0eVRleHQ6ICcnLFxuICAgIGxpc3RDbGFzczogJ2xpc3QtdW5zdHlsZWQnLFxuICAgIGFjdGl2ZUNsYXNzOiAnYWN0aXZlJyxcblxuICAgIGF1dG9zZWxlY3Q6IGZhbHNlLFxuXG4gICAgaW5pdDogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCl7XG4gICAgICAkc2NvcGUubmdNb2RlbCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKTtcblxuICAgICAgLy9UT0RPOiBtaXhpbj9cbiAgICAgICRzY29wZS4kd2F0Y2goJ2F1dG9zZWxlY3QgJiYgaXRlbXMgJiYgKCAhIG5nTW9kZWwuJG1vZGVsVmFsdWUpJywgZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAmJiAkc2NvcGUubmdNb2RlbC4kc2V0Vmlld1ZhbHVlKCRzY29wZS5maXJzdEl0ZW0oKSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZmlyc3RJdGVtOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXNbIE9iamVjdC5rZXlzKHRoaXMuaXRlbXMpWzBdIF07XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBuZy1zaG93PVwiIGhlYWRpbmcgXCI+e3sgaGVhZGluZyB9fTwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIGhlYWRpbmc6ICcnXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOiAnPGNvbnRlbnQgbmctc2hvdz1cIiBwYXJlbnRUYWJzU2NvcGUuYWN0aXZlVGFiID09IHRoaXMgXCI+PC9jb250ZW50PicsXG5cbiAgICBuYW1lOiAnJyxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKCRlbGVtZW50KXtcbiAgICAgIHRoaXMucGFyZW50VGFic1Njb3BlID0gJGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkuaXNvbGF0ZVNjb3BlKCk7XG4gICAgICB0aGlzLnBhcmVudFRhYnNTY29wZS50YWJzLnB1c2godGhpcyk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTogJ253LXRhYnMgbnctbGlzdHtkaXNwbGF5OiBibG9jazsgbWFyZ2luLWJvdHRvbTogMWVtfScsXG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8bnctbGlzdCBpdGVtcz1cIiB0YWJzIFwiIGxpc3QtY2xhc3M9XCJuYXYgbmF2LXRhYnNcIiBuZy1tb2RlbD1cImFjdGl2ZVRhYlwiIGF1dG9zZWxlY3Q+PC9udy1saXN0PicgK1xuICAgICAgJzxjb250ZW50PjwvY29udGVudD4nLFxuXG4gICAgdGFiczogW10sXG5cbiAgICBpbml0OiBmdW5jdGlvbigpe1xuICAgICAgLy9kbyBub3Qgc2hhcmVcbiAgICAgIHRoaXMudGFicyA9IFtdO1xuICAgIH1cbiAgfSk7XG59OyJdfQ==
