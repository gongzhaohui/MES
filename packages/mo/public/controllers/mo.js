'use strict';

angular.module('mean').controller('MoController', ['$scope', 'Global',
  function($scope, Global, Mo) {
    $scope.global = Global;
    $scope.mo = {name:'mo'};

  }
]);