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
  .directive('nwPanel', require('./src/nw-panel'))
  .directive('nwModal', require('./src/nw-modal'))

  .directive('nwGrid', require('./src/nw-grid'))
//  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
//  .directive('nwTab', require('./src/nw-tab'))
;
},{"./src/content":3,"./src/ngWidget.js":4,"./src/nw-field":5,"./src/nw-grid":6,"./src/nw-list":7,"./src/nw-modal":8,"./src/nw-panel":9,"./src/nw-tabs":10,"./src/qsa.js":11,"angular":2}],2:[function(require,module,exports){
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
    restrict: 'E',
    template: '',
    transclude: true,
    scope: {}
  }, widgetDef);
};
},{"angular":2}],5:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="form-group" ng-class=" {\'has-error\': ngModel.$dirty && ngModel.$invalid} ">' +
      '  <label ng-show=" label " class="control-label">{{ label }}</label>' +
      '  <content></content>' +
      '</div>',

    scope: {
      label: '@'
    },

    link: function($scope, $element){
      var control = $element.find('textarea, select, input:not([type="radio"]):not([type="checkbox"])');

      $scope.ngModel = control.controller('ngModel');

      control.addClass('form-control');
    }
  });
};
},{}],6:[function(require,module,exports){
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
      '</table>'
  });
};
},{"angular":2}],7:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<ul ng-show=" items ">' +
      '  <li ng-repeat=" it in items ">' +
      '    {{ it.name }}' +
      '  </li>' +
      '</ul>'
  });
};
},{}],8:[function(require,module,exports){
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
      '  <div class="modal-header" ng-show=" header "><h3 class="modal-title">{{ header }}</h3></div>' +
      '  <div class="modal-body">' +
      '    <content></content>' +
      '  </div>' +
      '  <div class="modal-footer" ng-show=" footer ">{{ footer }}</div>' +
      '</div></div></div>'
  });
};
},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template:
      '<div class="panel panel-default">' +
      '  <div class="panel-heading" ng-show=" name ">{{ name }}</div>' +
      '  <div class="panel-body">' +
      '    <content></content>' +
      '  </div>' +
      '</div>',

    scope: {
      name: '@'
    }
  });
};
},{}],10:[function(require,module,exports){
'use strict';

var angular = require('angular');

module.exports = function(ngWidget){
  return ngWidget({
    style: 'nw-tabs nw-list{display: block; margin-bottom: 1em}',

    template:
      '<nw-list items=" tabs " list-class="nav nav-tabs" ng-model=" activeTab " autoselect></nw-list>' +
      '<content></content>'
  });
};
},{"angular":2}],11:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zaGltcy9hbmd1bGFyLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXN0LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LW1vZGFsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXBhbmVsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXRhYnMuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvcXNhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyXG4gIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4gIG5nV2lkZ2V0cyA9IGFuZ3VsYXIubW9kdWxlKCduZ1dpZGdldHMnLCBbXSlcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZ1dpZGdldHM7XG5cbmFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUuZmluZCA9IHJlcXVpcmUoJy4vc3JjL3FzYS5qcycpO1xuXG5uZ1dpZGdldHNcbiAgLnZhbHVlKCduZ1dpZGdldCcsIHJlcXVpcmUoJy4vc3JjL25nV2lkZ2V0LmpzJykpXG5cbiAgLmRpcmVjdGl2ZSgnY29udGVudCcsIHJlcXVpcmUoJy4vc3JjL2NvbnRlbnQnKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXN0JywgcmVxdWlyZSgnLi9zcmMvbnctbGlzdCcpKVxuICAuZGlyZWN0aXZlKCdud0ZpZWxkJywgcmVxdWlyZSgnLi9zcmMvbnctZmllbGQnKSlcbiAgLmRpcmVjdGl2ZSgnbndQYW5lbCcsIHJlcXVpcmUoJy4vc3JjL253LXBhbmVsJykpXG4gIC5kaXJlY3RpdmUoJ253TW9kYWwnLCByZXF1aXJlKCcuL3NyYy9udy1tb2RhbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253R3JpZCcsIHJlcXVpcmUoJy4vc3JjL253LWdyaWQnKSlcbi8vICAuZGlyZWN0aXZlKCdud0dyaWRDb2wnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkLWNvbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253VGFicycsIHJlcXVpcmUoJy4vc3JjL253LXRhYnMnKSlcbi8vICAuZGlyZWN0aXZlKCdud1RhYicsIHJlcXVpcmUoJy4vc3JjL253LXRhYicpKVxuOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LmFuZ3VsYXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIGN0cmxzLCAkdHJhbnNjbHVkZSl7XG4gICAgICAkdHJhbnNjbHVkZSgkc2NvcGUuJHBhcmVudCwgJGVsZW1lbnQuYXBwZW5kLmJpbmQoJGVsZW1lbnQpKTtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyXG4gIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aWRnZXREZWYpe1xuICByZXR1cm4gYW5ndWxhci5leHRlbmQoe30sIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlOiAnJyxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHNjb3BlOiB7fVxuICB9LCB3aWRnZXREZWYpO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCIge1xcJ2hhcy1lcnJvclxcJzogbmdNb2RlbC4kZGlydHkgJiYgbmdNb2RlbC4kaW52YWxpZH0gXCI+JyArXG4gICAgICAnICA8bGFiZWwgbmctc2hvdz1cIiBsYWJlbCBcIiBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj57eyBsYWJlbCB9fTwvbGFiZWw+JyArXG4gICAgICAnICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIHNjb3BlOiB7XG4gICAgICBsYWJlbDogJ0AnXG4gICAgfSxcblxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQpe1xuICAgICAgdmFyIGNvbnRyb2wgPSAkZWxlbWVudC5maW5kKCd0ZXh0YXJlYSwgc2VsZWN0LCBpbnB1dDpub3QoW3R5cGU9XCJyYWRpb1wiXSk6bm90KFt0eXBlPVwiY2hlY2tib3hcIl0pJyk7XG5cbiAgICAgICRzY29wZS5uZ01vZGVsID0gY29udHJvbC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgIGNvbnRyb2wuYWRkQ2xhc3MoJ2Zvcm0tY29udHJvbCcpO1xuICAgIH1cbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHN0eWxlOlxuICAgICAgLy9oYW5kICsgdW5zZWxlY3RhYmxlXG4gICAgICAnbnctZ3JpZCB0aGVhZCB0aHtjdXJzb3I6IHBvaW50ZXI7IC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgLWtodG1sLXVzZXItc2VsZWN0OiBub25lOyAtbW96LXVzZXItc2VsZWN0OiBub25lOyAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lfScgK1xuICAgICAgJ253LWdyaWRbbmctbW9kZWxdIHRib2R5IHRye2N1cnNvcjogcG9pbnRlcn0nICtcblxuICAgICAgLy9jYXJyZXQgdmlzaWJpbGl0eVxuICAgICAgJ253LWdyaWQgdGggaS5mYXt2aXNpYmlsaXR5OiBoaWRkZW59JyArXG4gICAgICAnbnctZ3JpZCB0aC5hY3RpdmUgaS5mYXt2aXNpYmlsaXR5OiB2aXNpYmxlfScgK1xuXG4gICAgICAvL2Jvb3RzdHJhcCBidWc/IHN0cmlwZWQgKyBob3ZlciArIGFjdGl2ZVxuICAgICAgJ253LWdyaWQgdHIuYWN0aXZlIHRke2JhY2tncm91bmQ6ICM2OGMgIWltcG9ydGFudDsgY29sb3I6ICNmZmYgIWltcG9ydGFudH0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS1ob3ZlciB0YWJsZS1ib3JkZXJlZFwiPicgK1xuICAgICAgJyAgPHRoZWFkPicgK1xuICAgICAgJyAgICA8dHI+JyArXG4gICAgICAnICAgIDx0aCcgK1xuICAgICAgJyAgICAgIG5nLXJlcGVhdD1cIiBjb2wgaW4gY29scyBcIiAnICtcbiAgICAgICcgICAgICBuZy1jbGFzcz1cIiB7YWN0aXZlOiBjb2wgPT0gc29ydENvbH0gXCIgJyArXG4gICAgICAnICAgICAgbmctY2xpY2s9XCIgJHBhcmVudC5yZXZlcnNlID0gKChjb2wgPT0gc29ydENvbCkgJiYgIXJldmVyc2UpOyAkcGFyZW50LnNvcnRDb2wgPSBjb2wgXCIgJyArXG4gICAgICAnICAgID4nICtcbiAgICAgICcgICAgICB7eyBjb2wubmFtZSB9fSAnICtcbiAgICAgICcgICAgICA8aSBjbGFzcz1cImZhIGZhLWNhcmV0LXt7IHJldmVyc2UgP1xcJ2Rvd25cXCcgOlxcJ3VwXFwnIH19IHB1bGwtcmlnaHRcIj48L2k+JyArXG4gICAgICAnICAgIDwvdGg+JyArXG4gICAgICAnICAgIDwvdHI+JyArXG4gICAgICAnICA8L3RoZWFkPicgK1xuICAgICAgJyAgPHRib2R5PicgK1xuICAgICAgJyAgICA8dHI+PHRkPlZhbHVlPC90ZD48L3RyPicgK1xuICAgICAgJyAgPC90Ym9keT4nICtcbiAgICAgICc8L3RhYmxlPidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgdGVtcGxhdGU6XG4gICAgICAnPHVsIG5nLXNob3c9XCIgaXRlbXMgXCI+JyArXG4gICAgICAnICA8bGkgbmctcmVwZWF0PVwiIGl0IGluIGl0ZW1zIFwiPicgK1xuICAgICAgJyAgICB7eyBpdC5uYW1lIH19JyArXG4gICAgICAnICA8L2xpPicgK1xuICAgICAgJzwvdWw+J1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTogJ253LW1vZGFsIC5tb2RhbHtkaXNwbGF5OiBibG9ja30nLFxuXG4gICAgLy9vcHRpb25hbCBmdWxsLWhlaWdodCBzdHlsZXNcbiAgICAvL1RPRE86IGNvbnNpZGVyIGludHJvZHVjaW5nIG5ldyBlbGVtZW50XG4gICAgLy9UT0RPOiBjb25zaWRlciByZWxhdGlvbiB0byBvdmVybGF5XG4gICAgLy9cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtY29udGVudHtib3JkZXItcmFkaXVzOiAwOyBib3JkZXI6IDA7IGhlaWdodDogMTAwJX1cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtZGlhbG9ne3Bvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgbWFyZ2luOiAwOyB0b3A6IDA7IGxlZnQ6IDB9XG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWxcIiByb2xlPVwiZGlhbG9nXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCIgbmctc2hvdz1cIiBoZWFkZXIgXCI+PGgzIGNsYXNzPVwibW9kYWwtdGl0bGVcIj57eyBoZWFkZXIgfX08L2gzPjwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCIgbmctc2hvdz1cIiBmb290ZXIgXCI+e3sgZm9vdGVyIH19PC9kaXY+JyArXG4gICAgICAnPC9kaXY+PC9kaXY+PC9kaXY+J1xuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBuZy1zaG93PVwiIG5hbWUgXCI+e3sgbmFtZSB9fTwvZGl2PicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4nICtcbiAgICAgICcgICAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJyAgPC9kaXY+JyArXG4gICAgICAnPC9kaXY+JyxcblxuICAgIHNjb3BlOiB7XG4gICAgICBuYW1lOiAnQCdcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTogJ253LXRhYnMgbnctbGlzdHtkaXNwbGF5OiBibG9jazsgbWFyZ2luLWJvdHRvbTogMWVtfScsXG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8bnctbGlzdCBpdGVtcz1cIiB0YWJzIFwiIGxpc3QtY2xhc3M9XCJuYXYgbmF2LXRhYnNcIiBuZy1tb2RlbD1cIiBhY3RpdmVUYWIgXCIgYXV0b3NlbGVjdD48L253LWxpc3Q+JyArXG4gICAgICAnPGNvbnRlbnQ+PC9jb250ZW50PidcbiAgfSk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICB2YXIgcmVzID0gW107XG5cbiAgW10uZm9yRWFjaC5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVsKXtcbiAgICByZXMucHVzaC5hcHBseShyZXMsIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFuZ3VsYXIuZWxlbWVudChyZXMpO1xufTsiXX0=
