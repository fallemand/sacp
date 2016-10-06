'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile', {
                url: '/profile/:type/:id',
                template: '<profile></profile>',
                parent: 'private',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Perfil'
                }
            });
    });
