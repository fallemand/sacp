'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                template: '<main></main>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Principal'
                }
            });
    });
