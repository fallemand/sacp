'use strict';

angular.module('sacpApp')
    .directive('datatable', function () {
        return {
            templateUrl: 'components/datatable/datatable.html',
            restrict: 'EA',
            controller: 'DatatableController',
            controllerAs: 'vm',
            scope: {
                metadata: '=',
                cancelEvent: '=',
                activateEvent: '='
            }
        };
    });
