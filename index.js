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