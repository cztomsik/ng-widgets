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

  .directive('nwGrid', require('./src/nw-grid'))
//  .directive('nwGridCol', require('./src/nw-grid-col'))

  .directive('nwTabs', require('./src/nw-tabs'))
//  .directive('nwTab', require('./src/nw-tab'))
;
},{"./src/content":3,"./src/ngWidget.js":4,"./src/nw-field":5,"./src/nw-grid":6,"./src/nw-list":7,"./src/nw-modal":8,"./src/nw-panel":9,"./src/nw-row":10,"./src/nw-tabs":11,"./src/qsa.js":12,"angular":2}],2:[function(require,module,exports){
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
      '</ul>' +
      '<p ng-hide=" items ">{{ emptyText }}</p>',

    controller: function($scope){
      $scope.emptyText = 'No items found';
    }
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
      '  <div class="modal-header" ng-show=" name "><h3 class="modal-title">{{ name }}</h3></div>' +
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
      '</div>'
  });
};
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngWidget){
  return ngWidget({
    template: '<div class="row"><content></content></div>',
    link: function($scope, $element, $attrs){
      $element.find('.row > content').children().addClass($attrs.itemClass);
    }
  });
};
},{}],11:[function(require,module,exports){
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
},{"angular":2}],12:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvaW5kZXguanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zaGltcy9hbmd1bGFyLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL2NvbnRlbnQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbmdXaWRnZXQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZmllbGQuanMiLCIvVXNlcnMvY3p0b21zaWsvRGVza3RvcC9wbGF5Z3JvdW5kL25nV2lkZ2V0cy9zcmMvbnctZ3JpZC5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy1saXN0LmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LW1vZGFsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXBhbmVsLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL253LXJvdy5qcyIsIi9Vc2Vycy9jenRvbXNpay9EZXNrdG9wL3BsYXlncm91bmQvbmdXaWRnZXRzL3NyYy9udy10YWJzLmpzIiwiL1VzZXJzL2N6dG9tc2lrL0Rlc2t0b3AvcGxheWdyb3VuZC9uZ1dpZGdldHMvc3JjL3FzYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyXG4gIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4gIG5nV2lkZ2V0cyA9IGFuZ3VsYXIubW9kdWxlKCduZ1dpZGdldHMnLCBbXSlcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZ1dpZGdldHM7XG5cbmFuZ3VsYXIuZWxlbWVudC5wcm90b3R5cGUuZmluZCA9IHJlcXVpcmUoJy4vc3JjL3FzYS5qcycpO1xuXG5uZ1dpZGdldHNcbiAgLnZhbHVlKCduZ1dpZGdldCcsIHJlcXVpcmUoJy4vc3JjL25nV2lkZ2V0LmpzJykpXG5cbiAgLmRpcmVjdGl2ZSgnY29udGVudCcsIHJlcXVpcmUoJy4vc3JjL2NvbnRlbnQnKSlcbiAgLmRpcmVjdGl2ZSgnbndMaXN0JywgcmVxdWlyZSgnLi9zcmMvbnctbGlzdCcpKVxuICAuZGlyZWN0aXZlKCdud0ZpZWxkJywgcmVxdWlyZSgnLi9zcmMvbnctZmllbGQnKSlcbiAgLmRpcmVjdGl2ZSgnbndSb3cnLCByZXF1aXJlKCcuL3NyYy9udy1yb3cnKSlcbiAgLmRpcmVjdGl2ZSgnbndQYW5lbCcsIHJlcXVpcmUoJy4vc3JjL253LXBhbmVsJykpXG4gIC5kaXJlY3RpdmUoJ253TW9kYWwnLCByZXF1aXJlKCcuL3NyYy9udy1tb2RhbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253R3JpZCcsIHJlcXVpcmUoJy4vc3JjL253LWdyaWQnKSlcbi8vICAuZGlyZWN0aXZlKCdud0dyaWRDb2wnLCByZXF1aXJlKCcuL3NyYy9udy1ncmlkLWNvbCcpKVxuXG4gIC5kaXJlY3RpdmUoJ253VGFicycsIHJlcXVpcmUoJy4vc3JjL253LXRhYnMnKSlcbi8vICAuZGlyZWN0aXZlKCdud1RhYicsIHJlcXVpcmUoJy4vc3JjL253LXRhYicpKVxuOyIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LmFuZ3VsYXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIGN0cmxzLCAkdHJhbnNjbHVkZSl7XG4gICAgICAkdHJhbnNjbHVkZSgkc2NvcGUuJHBhcmVudCwgJGVsZW1lbnQuYXBwZW5kLmJpbmQoJGVsZW1lbnQpKTtcbiAgICB9XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyXG4gIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJylcbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aWRnZXREZWYpe1xuICByZXR1cm4gYW5ndWxhci5leHRlbmQoe30sIHtcbiAgICAvL2RlZmF1bHRzXG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZTogJycsXG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICBzY29wZToge30sXG5cbiAgICAvL2FjdHVhbCBzdHVmZlxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwcmU6IHRoaXMucHJlbGluay5iaW5kKHRoaXMpLFxuICAgICAgICBwb3N0OiB0aGlzLmxpbmsgJiYgdGhpcy5saW5rLmJpbmQodGhpcylcbiAgICAgIH07XG4gICAgfSxcblxuICAgIHByZWxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycyl7XG4gICAgICBmb3IgKHZhciBrIGluICRhdHRycy4kYXR0cil7XG4gICAgICAgICRzY29wZVtrXSA9ICRhdHRyc1trXTtcblxuICAgICAgICBpZiAoJGF0dHJzLiQkb2JzZXJ2ZXJzICYmICRhdHRycy4kJG9ic2VydmVyc1trXSl7XG4gICAgICAgICAgJGF0dHJzLiRvYnNlcnZlKGssIGRvdFNldCgkc2NvcGUsIGspKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwgd2lkZ2V0RGVmKTtcbn07XG5cbmZ1bmN0aW9uIGRvdFNldChvYmosIHByb3Ape1xuICByZXR1cm4gZnVuY3Rpb24odmFsKXtcbiAgICBvYmpbcHJvcF0gPSB2YWw7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwiIHtcXCdoYXMtZXJyb3JcXCc6IG5nTW9kZWwuJGRpcnR5ICYmIG5nTW9kZWwuJGludmFsaWR9IFwiPicgK1xuICAgICAgJyAgPGxhYmVsIG5nLXNob3c9XCIgbGFiZWwgXCIgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+e3sgbGFiZWwgfX08L2xhYmVsPicgK1xuICAgICAgJyAgPGNvbnRlbnQ+PC9jb250ZW50PicgK1xuICAgICAgJzwvZGl2PicsXG5cbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50KXtcbiAgICAgIHZhciBjb250cm9sID0gJGVsZW1lbnQuZmluZCgndGV4dGFyZWEsIHNlbGVjdCwgaW5wdXQ6bm90KFt0eXBlPVwicmFkaW9cIl0pOm5vdChbdHlwZT1cImNoZWNrYm94XCJdKScpO1xuXG4gICAgICAkc2NvcGUubmdNb2RlbCA9IGNvbnRyb2wuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICBjb250cm9sLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wnKTtcbiAgICB9XG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTpcbiAgICAgIC8vaGFuZCArIHVuc2VsZWN0YWJsZVxuICAgICAgJ253LWdyaWQgdGhlYWQgdGh7Y3Vyc29yOiBwb2ludGVyOyAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7IC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7IC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTsgLW1vei11c2VyLXNlbGVjdDogbm9uZTsgLW1zLXVzZXItc2VsZWN0OiBub25lOyB1c2VyLXNlbGVjdDogbm9uZX0nICtcbiAgICAgICdudy1ncmlkW25nLW1vZGVsXSB0Ym9keSB0cntjdXJzb3I6IHBvaW50ZXJ9JyArXG5cbiAgICAgIC8vY2FycmV0IHZpc2liaWxpdHlcbiAgICAgICdudy1ncmlkIHRoIGkuZmF7dmlzaWJpbGl0eTogaGlkZGVufScgK1xuICAgICAgJ253LWdyaWQgdGguYWN0aXZlIGkuZmF7dmlzaWJpbGl0eTogdmlzaWJsZX0nICtcblxuICAgICAgLy9ib290c3RyYXAgYnVnPyBzdHJpcGVkICsgaG92ZXIgKyBhY3RpdmVcbiAgICAgICdudy1ncmlkIHRyLmFjdGl2ZSB0ZHtiYWNrZ3JvdW5kOiAjNjhjICFpbXBvcnRhbnQ7IGNvbG9yOiAjZmZmICFpbXBvcnRhbnR9JyxcblxuICAgIHRlbXBsYXRlOlxuICAgICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtaG92ZXIgdGFibGUtYm9yZGVyZWRcIj4nICtcbiAgICAgICcgIDx0aGVhZD4nICtcbiAgICAgICcgICAgPHRyPicgK1xuICAgICAgJyAgICA8dGgnICtcbiAgICAgICcgICAgICBuZy1yZXBlYXQ9XCIgY29sIGluIGNvbHMgXCIgJyArXG4gICAgICAnICAgICAgbmctY2xhc3M9XCIge2FjdGl2ZTogY29sID09IHNvcnRDb2x9IFwiICcgK1xuICAgICAgJyAgICAgIG5nLWNsaWNrPVwiICRwYXJlbnQucmV2ZXJzZSA9ICgoY29sID09IHNvcnRDb2wpICYmICFyZXZlcnNlKTsgJHBhcmVudC5zb3J0Q29sID0gY29sIFwiICcgK1xuICAgICAgJyAgICA+JyArXG4gICAgICAnICAgICAge3sgY29sLm5hbWUgfX0gJyArXG4gICAgICAnICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jYXJldC17eyByZXZlcnNlID9cXCdkb3duXFwnIDpcXCd1cFxcJyB9fSBwdWxsLXJpZ2h0XCI+PC9pPicgK1xuICAgICAgJyAgICA8L3RoPicgK1xuICAgICAgJyAgICA8L3RyPicgK1xuICAgICAgJyAgPC90aGVhZD4nICtcbiAgICAgICcgIDx0Ym9keT4nICtcbiAgICAgICcgICAgPHRyPjx0ZD5WYWx1ZTwvdGQ+PC90cj4nICtcbiAgICAgICcgIDwvdGJvZHk+JyArXG4gICAgICAnPC90YWJsZT4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzx1bCBuZy1zaG93PVwiIGl0ZW1zIFwiPicgK1xuICAgICAgJyAgPGxpIG5nLXJlcGVhdD1cIiBpdCBpbiBpdGVtcyBcIj4nICtcbiAgICAgICcgICAge3sgaXQubmFtZSB9fScgK1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicgK1xuICAgICAgJzxwIG5nLWhpZGU9XCIgaXRlbXMgXCI+e3sgZW1wdHlUZXh0IH19PC9wPicsXG5cbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuICAgICAgJHNjb3BlLmVtcHR5VGV4dCA9ICdObyBpdGVtcyBmb3VuZCc7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5nV2lkZ2V0KXtcbiAgcmV0dXJuIG5nV2lkZ2V0KHtcbiAgICBzdHlsZTogJ253LW1vZGFsIC5tb2RhbHtkaXNwbGF5OiBibG9ja30nLFxuXG4gICAgLy9vcHRpb25hbCBmdWxsLWhlaWdodCBzdHlsZXNcbiAgICAvL1RPRE86IGNvbnNpZGVyIGludHJvZHVjaW5nIG5ldyBlbGVtZW50XG4gICAgLy9UT0RPOiBjb25zaWRlciByZWxhdGlvbiB0byBvdmVybGF5XG4gICAgLy9cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtY29udGVudHtib3JkZXItcmFkaXVzOiAwOyBib3JkZXI6IDA7IGhlaWdodDogMTAwJX1cbiAgICAvLyBudy1tb2RhbCAubW9kYWwtZGlhbG9ne3Bvc2l0aW9uOiBmaXhlZDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgbWFyZ2luOiAwOyB0b3A6IDA7IGxlZnQ6IDB9XG5cbiAgICB0ZW1wbGF0ZTpcbiAgICAgICc8ZGl2IGNsYXNzPVwibW9kYWxcIiByb2xlPVwiZGlhbG9nXCI+PGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPjxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCIgbmctc2hvdz1cIiBuYW1lIFwiPjxoMyBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+e3sgbmFtZSB9fTwvaDM+PC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPicgK1xuICAgICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnICA8L2Rpdj4nICtcbiAgICAgICcgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIiBuZy1zaG93PVwiIGZvb3RlciBcIj57eyBmb290ZXIgfX08L2Rpdj4nICtcbiAgICAgICc8L2Rpdj48L2Rpdj48L2Rpdj4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOlxuICAgICAgJzxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIG5nLXNob3c9XCIgbmFtZSBcIj57eyBuYW1lIH19PC9kaXY+JyArXG4gICAgICAnICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPicgK1xuICAgICAgJyAgICA8Y29udGVudD48L2NvbnRlbnQ+JyArXG4gICAgICAnICA8L2Rpdj4nICtcbiAgICAgICc8L2Rpdj4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmdXaWRnZXQpe1xuICByZXR1cm4gbmdXaWRnZXQoe1xuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInJvd1wiPjxjb250ZW50PjwvY29udGVudD48L2Rpdj4nLFxuICAgIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycyl7XG4gICAgICAkZWxlbWVudC5maW5kKCcucm93ID4gY29udGVudCcpLmNoaWxkcmVuKCkuYWRkQ2xhc3MoJGF0dHJzLml0ZW1DbGFzcyk7XG4gICAgfVxuICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZ1dpZGdldCl7XG4gIHJldHVybiBuZ1dpZGdldCh7XG4gICAgc3R5bGU6ICdudy10YWJzIG53LWxpc3R7ZGlzcGxheTogYmxvY2s7IG1hcmdpbi1ib3R0b206IDFlbX0nLFxuXG4gICAgdGVtcGxhdGU6XG4gICAgICAnPG53LWxpc3QgaXRlbXM9XCIgdGFicyBcIiBsaXN0LWNsYXNzPVwibmF2IG5hdi10YWJzXCIgbmctbW9kZWw9XCIgYWN0aXZlVGFiIFwiIGF1dG9zZWxlY3Q+PC9udy1saXN0PicgK1xuICAgICAgJzxjb250ZW50PjwvY29udGVudD4nXG4gIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgdmFyIHJlcyA9IFtdO1xuXG4gIFtdLmZvckVhY2guY2FsbCh0aGlzLCBmdW5jdGlvbihlbCl7XG4gICAgcmVzLnB1c2guYXBwbHkocmVzLCBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gIH0pO1xuXG4gIHJldHVybiBhbmd1bGFyLmVsZW1lbnQocmVzKTtcbn07Il19
