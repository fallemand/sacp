'use strict';
(function () {

    class DatatableComponent {
        constructor() {
            this.message = 'Hello';
            this.parameters = {
                entity: 'user'
            }
        }
    }

    angular.module('sacpApp')
        .component('datatablepage', {
            templateUrl: 'app/datatable/datatable.html',
            controller: DatatableComponent,
            controllerAs: 'vm'
        });

})();
