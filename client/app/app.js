'use strict';

angular.module('sacpApp', [
        'sacpApp.auth',
        'sacpApp.admin',
        'sacpApp.constants',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'ncy-angular-breadcrumb',
        'ui.bootstrap',
        'validation.match',
        'ngTable',
        'ngAnimate'
    ])
    .config(function ($urlRouterProvider, $locationProvider, $stateProvider) {
        $urlRouterProvider
            .otherwise('/');

        //Define differents layouts
        $stateProvider
            .state('public', {
                abstract: true,
                views: {
                    'layout': {
                        templateUrl: 'components/layouts/public.html'
                    }
                }
            })
            .state('private', {
                abstract: true,
                views: {
                    'layout': {
                        templateUrl: 'components/layouts/private.html'
                    }
                }
            });

        $locationProvider.html5Mode(true);
    });
