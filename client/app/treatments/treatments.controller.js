'use strict';
(function () {

    class TreatmentsComponent {
        constructor($http, ngToast, $state, $stateParams) {
            this.loadedData = false;
            this.id = $stateParams.id;
            this.$http = $http;
            this.$state = $state;
            this.ngToast = ngToast;
            if(this.id.length > 0) {
                this.action = 'update';
                $http.get('/api/treatments/'+this.id).
                    then(response => {
                        this.object = response.data;
                        this.initialize();
                    })
                    .catch(err => {
                        if(err.data && err.data.name == 'CastError') {
                            err.message = 'El parametros no es correcto';
                        }
                        this.ngToast.create({
                            className: 'danger',
                            content: err.message
                        });
                    });
            }
            else {
                this.initialize();
            }
        }

        initialize() {
            this.loadedData = true;
            this.steps = [
                {
                    templateUrl: 'app/treatments/steps/_patient.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_disease.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_treatment.html',
                    hasForm: true
                },
                {
                    templateUrl: 'app/treatments/steps/_drugs.html',
                },
                {
                    templateUrl: 'app/treatments/steps/_confirm.html',
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
                field: 'drugs',
                type: 'local',
                template: 'short',
                metadataFilters: 'field=drugs',
                object: this.object,
                formGroupClass : 'col-md-4',
                inputIcons : true,
                reloadEvent: (function() {
                    if(this.drugsTable.ngtable) {
                        this.drugsTable.ngtable.reload();
                    }
                }).bind(this)
            };

            this.autoformConfirm = {
                entity: 'treatments',
                section: 'confirm',
                object: this.object,
                template: 'lite'
            };

            this.drugsTable = {
                entity: 'treatments',
                type: 'local',
                metadataFilters: 'field=drugs',
                actions: ['view', 'modify', 'delete'],
                reloadEvent: (function() {
                    if(this.object.drugs.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
                initEvent: (function() {
                    if(this.object.drugs.length > 0) {
                        this.validStep = true;
                    }
                }).bind(this),
            };
        }

        stepChange(activeIndex, hasForm) {
            this.progressBarWidth = (100 / this.steps.length) * activeIndex + '%';
            if(!hasForm) {
                this.validStep = false;
            }
            else {
                this.validStep = true;
            }
        }

        cancel() {
            this.progressBarWidth = (100 / this.wizard.getSteps().length) + '%';
        }

        finish() {
            this.submitted = true;
            if(this.autoformConfirm.form.$valid) {
                this.isSaving = true;
                if (this.object._id) {
                    //Fix sub-object changes
                    for (var attribute in this.object) {
                        if (this.object[attribute].hasOwnProperty('_id')) {
                            this.object[attribute] = this.object[attribute]._id;
                        }
                    }
                    this.$http.put('/api/treatments/' + this.object._id, this.object).then(() => {
                            this.object = angular.copy({});
                            this.ngToast.create('Tratamiento modificado con éxito!');
                            this.$state.go('treatments');
                        })
                        .catch(err => {
                            this.handleError(err);
                        });
                }
                else {
                    this.$http.post('/api/treatments', this.object).then(() => {
                            this.object = angular.copy({});
                            this.ngToast.create('Tratamiento agregado con éxito!');
                            this.$state.go('treatments');
                        })
                        .catch(err => {
                            this.handleError(err);
                        });
                }

            }
        }

        handleError(err) {
            var errors = err.data.errors;
            if(errors) {
                this.errors = {};
                // Update validity of form fields that match the mongoose errors
                angular.forEach(errors, (error, field) => {
                    this.autoform.form[field].$setValidity('mongoose', false);
                    this.errors[field] = error.message;
                });
            }
            else {
                this.ngToast.create({
                    className: 'warning',
                    content: err.message
                });
            }
            this.autoform.isSaving = false;
        }

    }

    angular.module('sacpApp')
        .component('treatments', {
            templateUrl: 'app/treatments/treatments.html',
            controller: TreatmentsComponent,
            controllerAs: 'vm'
        });

})();
