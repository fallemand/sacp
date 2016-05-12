'use strict';
(function () {

    class TreatmentsComponent {
        constructor() {
            this.message = 'Hello';
            this.steps = [
                {template: 'Hello <button class="btn btn-default" ng-click="$nextStep()">Next</button>'},
                {template: 'World <button class="btn btn-default" ng-click="$previousStep()">Previous</button>'}
            ];
        }
    }

    angular.module('sacpApp')
        .component('treatments', {
            templateUrl: 'app/treatments/treatments.html',
            controller: TreatmentsComponent,
            controllerAs: 'vm'
        });

})();
