'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'partials/index.html', controller: IndexController});
    $routeProvider.otherwise({redirectTo: '/index'});
  }]);
