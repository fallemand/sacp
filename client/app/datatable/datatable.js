'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('datatable', {
                url: '/datatable',
                template: '<datatablepage></datatablepage>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Tablas'
                }
            });
    });
