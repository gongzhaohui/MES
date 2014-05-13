'use strict';

angular.module('mean').controller('MesController', ['$scope', 'Global',
    function($scope, Global, Mes) {
        $scope.global = Global;
        $scope.mes = {
            name: 'mes'
        };
    }
]);
