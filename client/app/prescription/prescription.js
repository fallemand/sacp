'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('prescription', {
                url: '/prescription/:id',
                template: '<prescription></prescription>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Receta'
                }
            });
    });
