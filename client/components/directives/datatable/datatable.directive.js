'use strict';

angular.module('sacpApp')
    .directive('datatable', function () {
        return {
            templateUrl: 'components/directives/datatable/datatable.html',
            restrict: 'EA',
            controller: 'DatatableController',
            controllerAs: 'vm',
            scope: {
                parameters: '='
            }
        };
    });
