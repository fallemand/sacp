'use strict';
(function () {

    class TreatmentsComponent {
        constructor() {
            this.message = 'Hello';
            this.steps = [
                {
                    templateUrl: 'app/treatments/steps/_patient.html',
                    title: 'Get the source'
                },
                {
                    templateUrl: 'app/treatments/steps/_disease.html',
                    title: 'Add it to your app'
                },
                {
                    templateUrl: 'app/treatments/steps/_treatment.html',
                    title: 'Create your multi step forms / wizzards'
                },
                {
                    templateUrl: 'app/treatments/steps/_drugs.html',
                    title: 'Create your multi step forms / wizzards'
                },
                {
                    templateUrl: 'app/treatments/steps/_confirm.html',
                    title: 'Create your multi step forms / wizzards'
                }
            ];

            this.autoformDisease = {
                entity : 'treatments',
                section: 'disease',
                template : 'full'
            };
        }

        stepChange(activeIndex) {
            this.progressBarWidth = (100 / this.steps.length) * activeIndex  + '%';
        }

        cancel() {
            this.progressBarWidth = (100 / this.wizard.getSteps().length) + '%';
        }

        finish() {
            this.progressBarWidth = (100 / this.wizard.getSteps().length) + '%';
        }
    }

    angular.module('sacpApp')
        .component('treatments', {
            templateUrl: 'app/treatments/treatments.html',
            controller: TreatmentsComponent,
            controllerAs: 'vm'
        });

})();
