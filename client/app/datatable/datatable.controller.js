'use strict';
(function () {

    class DatatableComponent {
        constructor() {
            this.message = 'Hello';
            this.parameters = {
                entity: 'users',
                filters: 'active=true',
                actions: ['activate', 'delete'],
                reloadEvent : function() {
                    alert(true);
                }
            };
            this.inputParameters = {
                'entity' : 'user',
                'title': 'Nombre',
                'pluralTitle': 'Nombres',
                'field' : 'name',
                'type': 'string',
                'show': true,
                'icon': 'fa fa-user-md',
                'iconText' : 'USR',
                'restrictions' : {
                    required: true,
                    min: '10',
                    max: '20'
                }
            };
        }
    }

    angular.module('sacpApp')
        .component('datatablepage', {
            templateUrl: 'app/datatable/datatable.html',
            controller: DatatableComponent,
            controllerAs: 'vm'
        });

})();
