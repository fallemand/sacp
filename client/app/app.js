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
        'ngAnimate',
        'hSweetAlert',
        'ngToast',
        'multiStepForm'
    ])
    .config(function ($urlRouterProvider, $locationProvider, $stateProvider, $animateProvider) {
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

        //Disable ngAnimate for some elements.
        $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);

        $locationProvider.html5Mode(true);
    });
