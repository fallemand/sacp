'use strict';

angular.module('sacpApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('patients', {
                url: '/patients',
                templateUrl: 'app/list/patients/patients.html',
                controller: 'PatientsController',
                controllerAs: 'vm',
                parent: 'private',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Listado Pacientes'
                }
            })
            .state('doctors', {
                url: '/doctors',
                templateUrl: 'app/list/doctors/doctors.html',
                controller: 'DoctorsController',
                controllerAs: 'vm',
                parent: 'private',
                authenticate: 'admin',
                ncyBreadcrumb: {
                    label: 'Listado Médicos'
                }
            })
            .state('treatments', {
                url: '/treatments',
                templateUrl: 'app/list/treatments/treatments.html',
                controller: 'TreatmentsController',
                controllerAs: 'vm',
                parent: 'private',
                authenticate: true,
                ncyBreadcrumb: {
                    label: 'Listado Tratamientos'
                }
            })
            .state('drug-presentations', {
                url: '/drug-presentations',
                templateUrl: 'app/list/drug-presentations/drug-presentations.html',
                controller: 'DrugPresentationsController',
                controllerAs: 'vm',
                parent: 'private',
                authenticate: 'admin',
                ncyBreadcrumb: {
                    label: 'Listado de Presentaciones de Drogas'
                }
            })
            .state('drugs', {
                url: '/drugs',
                templateUrl: 'app/list/drugs/drugs.html',
                controller: 'DrugsController',
                controllerAs: 'vm',
                parent: 'private',
                authenticate: 'admin',
                ncyBreadcrumb: {
                    label: 'Listado de Drogas'
                }
            });
    });
