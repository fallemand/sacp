'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('treatments.view', {
                url: '/treatments/:id',
                template: '<viewtreatment></viewtreatment>',
                parent: 'private',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Ficha Tratamiento'
                }
            });
    });
