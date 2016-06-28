'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('treatments.view', {
                url: '/treatments/:id',
                template: '<viewtreatment></viewtreatment>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Ficha Tratamiento'
                }
            });
    });
