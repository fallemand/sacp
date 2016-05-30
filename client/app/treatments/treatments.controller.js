'use strict';
(function () {

    class TreatmentsComponent {
        constructor() {
            this.message = 'Hello';
            this.object = {};
            this.steps = [
                {
                    templateUrl: 'app/treatments/steps/_patient.html',
                    title: 'Get the source',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_disease.html',
                    title: 'Add it to your app',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_treatment.html',
                    title: 'Create your multi step forms / wizzards',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_drugs.html',
                    title: 'Create your multi step forms / wizzards',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_confirm.html',
                    title: 'Create your multi step forms / wizzards',
                    hasForm: true
                }
            ];

            this.autoformDisease = {
                entity: 'treatments',
                section: 'disease',
                object: this.object,
                template: 'lite'
            };

            this.autoformPatient = {
                entity: 'treatments',
                object: this.object,
                section: 'patient',
                template: 'lite'
            };

            this.autoformTreatment = {
                entity: 'treatments',
                section: 'treatment',
                object: this.object,
                template: 'lite'
            };

            this.autoformDrugs = {
                entity: 'treatments',
                section: 'drugs',
                template: 'short',
                object: this.object,
                formGroupClass : 'col-md-4',
                inputIcons : true
            };

            this.autoformConfirm = {
                entity: 'treatments',
                section: 'confirm',
                object: this.object,
                template: 'lite'
            };

            this.drugsTable = {
                entity: 'treatments',
                section: 'drugs',
                actions: ['view', 'modify', 'delete'],
                initEvent: (function (table) {
                    this.patientsTable = table;
                }).bind(this),
                reloadEvent: (function () {
                    this.patientsTable.reload();
                }).bind(this),
                modifyEvent: (function (object) {
                    this.showPatientForm = true;
                    this.autoform.object = object;
                }).bind(this)
            };
        }

        stepChange(activeIndex) {
            this.progressBarWidth = (100 / this.steps.length) * activeIndex + '%';
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
