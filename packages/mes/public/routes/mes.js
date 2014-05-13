'use strict';

angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('mes example page', {
            url: '/mes/example',
            templateUrl: 'mes/views/index.html'
        });
    }
]);
