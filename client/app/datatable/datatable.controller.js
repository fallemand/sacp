'use strict';
(function () {

    class DatatableComponent {
        constructor() {
            this.parameters = {
                entity: 'users',
                filters: 'active=true',
                actions: ['activate', 'delete'],
                reloadEvent : function() {
                    alert(true);
                }
            };
            this.inputParameters = {
                'entity' : 'patients',
                'formGroupClass' : 'col-md-3',
                'template' : 'short'
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
