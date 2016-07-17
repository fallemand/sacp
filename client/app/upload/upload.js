'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('upload', {
                url: '/upload',
                template: '<upload></upload>',
                parent: 'private',
                ncyBreadcrumb: {
                    label: 'Subir Imágenes'
                }
            });
    });
