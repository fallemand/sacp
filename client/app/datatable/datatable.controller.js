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
            this.autoform = {
                'entity' : 'patients',
                'formGroupClass' : 'col-md-3',
                'template' : 'lite'
            };
        }

        submit() {
            alert(this.autoform.object.name)
        }
    }

    angular.module('sacpApp')
        .component('datatablepage', {
            templateUrl: 'app/datatable/datatable.html',
            controller: DatatableComponent,
            controllerAs: 'vm'
        });

})();
