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