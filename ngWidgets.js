(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* global angular */
var
  module = angular.module('ngWidgets', []),

  elements = {
    'content': require('./src/content'),
    'nwList': require('./src/nw-list'),
    'nwField': require('./src/nw-field'),
    'nwPanel': require('./src/nw-panel'),
    'nwGrid': require('./src/nw-grid')
  }
;


for (var k in elements){
  module.directive(k, angular.identity.bind(null, elements[k]));
}
},{"./src/content":2,"./src/nw-field":3,"./src/nw-grid":4,"./src/nw-list":5,"./src/nw-panel":6}],2:[function(require,module,exports){
'use strict';

module.exports = {
  restrict: 'E',
  controller: function($scope, $element, $transclude){
    $transclude($scope.$parent, $element.append.bind($element));
  }
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
    '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
    '  <content></content>' +
    '' +
    '  <p class="help-block">' +
    '    {{ help }}' +
    '  </p>' +
    '' +
    '  <ul class="help-block" ng-show=" ngModel.$dirty " style=" font-weight: bold ">' +
    '    <li ng-repeat=" (k, e) in ngModel.$error " ng-show=" e ">This field is {{ k }}</li>' +
    '  </ul>' +
    '</div>',
  transclude: true,
  scope: {
    label: '@'
  },
  controller: function($scope, $element, $timeout){
    $timeout(function(){
      $scope.ngModel = $element.find('content').children().addClass('form-control').controller('ngModel');
    });
  }
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
  restrict: 'E',
  template: 'a-grid'
};
},{}],5:[function(require,module,exports){
'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<ul ng-show=" items " class="{{listClass}}">' +
    '  <li ng-repeat=" it in items " ng-class=" { {{activeClass}}: ngModel.$modelValue == it} ">' +
    '    <a href="javascript:void()" ng-click=" ngModel.$setViewValue(it) ">{{ it.name }}</a>' +
    '  </li>' +
    '</ul>',
  scope: {
    emptyText: '@',
    listClass: '@',
    activeClass: '@'
  },
  controller: function($scope, $attrs, $element){
    $scope.emptyText = $scope.emptyText || 'No items found';
    $scope.listClass = $scope.listClass || 'list-unstyled';
    $scope.activeClass = $scope.activeClass || 'active';
    $scope.items = [];

    $scope.ngModel = $element.controller('ngModel');

    $scope.$parent.$watchCollection($attrs.items, function(items){
      $scope.items = items;
    });
  }
};
},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
  restrict: 'E',
  template:
    '<div class="panel panel-default">' +
    '  <div class="panel-heading" ng-show=" heading ">{{ heading }}</div>' +
    '  <div class="panel-body">' +
    '    <content></content>' +
    '  </div>' +
    '</div>',
  transclude: true,
  scope: {
    heading: '@'
  }
};
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvY29udGVudC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1maWVsZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1ncmlkLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LWxpc3QuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cbnZhclxuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnbmdXaWRnZXRzJywgW10pLFxuXG4gIGVsZW1lbnRzID0ge1xuICAgICdjb250ZW50JzogcmVxdWlyZSgnLi9zcmMvY29udGVudCcpLFxuICAgICdud0xpc3QnOiByZXF1aXJlKCcuL3NyYy9udy1saXN0JyksXG4gICAgJ253RmllbGQnOiByZXF1aXJlKCcuL3NyYy9udy1maWVsZCcpLFxuICAgICdud1BhbmVsJzogcmVxdWlyZSgnLi9zcmMvbnctcGFuZWwnKSxcbiAgICAnbndHcmlkJzogcmVxdWlyZSgnLi9zcmMvbnctZ3JpZCcpXG4gIH1cbjtcblxuXG5mb3IgKHZhciBrIGluIGVsZW1lbnRzKXtcbiAgbW9kdWxlLmRpcmVjdGl2ZShrLCBhbmd1bGFyLmlkZW50aXR5LmJpbmQobnVsbCwgZWxlbWVudHNba10pKTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZXN0cmljdDogJ0UnLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkdHJhbnNjbHVkZSl7XG4gICAgJHRyYW5zY2x1ZGUoJHNjb3BlLiRwYXJlbnQsICRlbGVtZW50LmFwcGVuZC5iaW5kKCRlbGVtZW50KSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVzdHJpY3Q6ICdFJyxcbiAgdGVtcGxhdGU6XG4gICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgJyAgPGxhYmVsIG5nLXNob3c9XCIgbGFiZWwgXCIgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+e3sgbGFiZWwgfX08L2xhYmVsPicgK1xuICAgICcgIDxjb250ZW50PjwvY29udGVudD4nICtcbiAgICAnJyArXG4gICAgJyAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+JyArXG4gICAgJyAgICB7eyBoZWxwIH19JyArXG4gICAgJyAgPC9wPicgK1xuICAgICcnICtcbiAgICAnICA8dWwgY2xhc3M9XCJoZWxwLWJsb2NrXCIgbmctc2hvdz1cIiBuZ01vZGVsLiRkaXJ0eSBcIiBzdHlsZT1cIiBmb250LXdlaWdodDogYm9sZCBcIj4nICtcbiAgICAnICAgIDxsaSBuZy1yZXBlYXQ9XCIgKGssIGUpIGluIG5nTW9kZWwuJGVycm9yIFwiIG5nLXNob3c9XCIgZSBcIj5UaGlzIGZpZWxkIGlzIHt7IGsgfX08L2xpPicgK1xuICAgICcgIDwvdWw+JyArXG4gICAgJzwvZGl2PicsXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHNjb3BlOiB7XG4gICAgbGFiZWw6ICdAJ1xuICB9LFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkdGltZW91dCl7XG4gICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICRzY29wZS5uZ01vZGVsID0gJGVsZW1lbnQuZmluZCgnY29udGVudCcpLmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpLmNvbnRyb2xsZXIoJ25nTW9kZWwnKTtcbiAgICB9KTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICByZXN0cmljdDogJ0UnLFxuICB0ZW1wbGF0ZTogJ2EtZ3JpZCdcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVzdHJpY3Q6ICdFJyxcbiAgdGVtcGxhdGU6XG4gICAgJzx1bCBuZy1zaG93PVwiIGl0ZW1zIFwiIGNsYXNzPVwie3tsaXN0Q2xhc3N9fVwiPicgK1xuICAgICcgIDxsaSBuZy1yZXBlYXQ9XCIgaXQgaW4gaXRlbXMgXCIgbmctY2xhc3M9XCIgeyB7e2FjdGl2ZUNsYXNzfX06IG5nTW9kZWwuJG1vZGVsVmFsdWUgPT0gaXR9IFwiPicgK1xuICAgICcgICAgPGEgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgpXCIgbmctY2xpY2s9XCIgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGl0KSBcIj57eyBpdC5uYW1lIH19PC9hPicgK1xuICAgICcgIDwvbGk+JyArXG4gICAgJzwvdWw+JyxcbiAgc2NvcGU6IHtcbiAgICBlbXB0eVRleHQ6ICdAJyxcbiAgICBsaXN0Q2xhc3M6ICdAJyxcbiAgICBhY3RpdmVDbGFzczogJ0AnXG4gIH0sXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGF0dHJzLCAkZWxlbWVudCl7XG4gICAgJHNjb3BlLmVtcHR5VGV4dCA9ICRzY29wZS5lbXB0eVRleHQgfHwgJ05vIGl0ZW1zIGZvdW5kJztcbiAgICAkc2NvcGUubGlzdENsYXNzID0gJHNjb3BlLmxpc3RDbGFzcyB8fCAnbGlzdC11bnN0eWxlZCc7XG4gICAgJHNjb3BlLmFjdGl2ZUNsYXNzID0gJHNjb3BlLmFjdGl2ZUNsYXNzIHx8ICdhY3RpdmUnO1xuICAgICRzY29wZS5pdGVtcyA9IFtdO1xuXG4gICAgJHNjb3BlLm5nTW9kZWwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAkc2NvcGUuJHBhcmVudC4kd2F0Y2hDb2xsZWN0aW9uKCRhdHRycy5pdGVtcywgZnVuY3Rpb24oaXRlbXMpe1xuICAgICAgJHNjb3BlLml0ZW1zID0gaXRlbXM7XG4gICAgfSk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVzdHJpY3Q6ICdFJyxcbiAgdGVtcGxhdGU6XG4gICAgJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+JyArXG4gICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBuZy1zaG93PVwiIGhlYWRpbmcgXCI+e3sgaGVhZGluZyB9fTwvZGl2PicgK1xuICAgICcgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+JyArXG4gICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgJyAgPC9kaXY+JyArXG4gICAgJzwvZGl2PicsXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHNjb3BlOiB7XG4gICAgaGVhZGluZzogJ0AnXG4gIH1cbn07Il19
