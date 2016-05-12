'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('add', {
                url: '/treatments/add',
                template: '<treatments></treatments>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Agregar'
                }
            });
    });
