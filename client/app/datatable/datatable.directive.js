'use strict';

angular.module('sacpApp')
    .directive('datatable', function () {
        return {
            templateUrl: 'app/datatable/datatable.html',
            restrict: 'EA',
            controller: 'DatatableController',
            controllerAs: 'vm',
            scope: {
                metadata: '='
            }
        };
    });
