'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                template: '<home></home>',
                parent: 'private',
                authenticate: 'admin',
                ncyBreadcrumb: {
                    label: 'Inicio'
                }
            });
    });
