'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                params: {
                    returnState: null,
                    returnParams: null
                },
                parent: 'public'
            })
            .state('recover', {
                url: '/recover',
                templateUrl: 'app/account/recover/recover.html',
                controller: 'RecoverController',
                controllerAs: 'vm',
                parent: 'public'
            })
            .state('logout', {
                url: '/logout?referrer',
                referrer: 'login',
                template: '',
                controller: function ($state, Auth) {
                    Auth.logout();
                    $state.go('login');
                },
                parent: 'public'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupController',
                controllerAs: 'vm',
                parent: 'public'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'app/account/settings/settings.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                authenticate: true,
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Configuración'
                }
            });
    })
    .run(function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
            if (next.name === 'logout' && current && current.name && !current.authenticate) {
                next.referrer = current.name;
            }
        });
    });
