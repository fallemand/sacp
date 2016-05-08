'use strict';
(function () {

    class DatatableComponent {
        constructor() {
            this.message = 'Hello';
            this.parameters = {
                entity: 'users',
                filters: 'active=true'
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
