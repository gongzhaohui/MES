'use strict';

angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('mo example page', {
        url: '/mo/example',
        templateUrl: 'mo/views/index.html'
      });
  }
]);