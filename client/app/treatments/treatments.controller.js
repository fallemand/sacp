'use strict';
(function () {

    class TreatmentsComponent {
        constructor($http, ngToast, $state, $stateParams, Auth) {
            this.loadedData = false;
            this.action = $stateParams.action;
            this.$http = $http;
            this.$state = $state;
            this.ngToast = ngToast;
            this.isAdmin = Auth.isAdmin();
            switch(this.action) {
                case 'add' :
                    this.initialize();
                    break;
                case 'update' :
                    this.getEntity($stateParams.id, (function() {
                        this.object.observation = '';
                        this.initialize();
                    }).bind(this));
                    break;
                case 'view' :
                    this.getEntity($stateParams.id, (function() {
                        this.initialize();
                    }).bind(this));
                    break;
            }
        }

        getEntity(id, callback) {
            this.$http.get('/api/treatments/'+id)
                .then(response => {
                    this.object = response.data;
                    if(callback) {
                        callback();
                    }
                })
                .catch(err => {
                    if(err.data && err.data.name == 'CastError') {
                        err.message = 'El parametro no es correcto';
                    }
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
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
                disabled : (this.action == 'view'),
                template: 'lite'
            };

            this.autoformPatient = {
                entity: 'treatments',
                object: this.object,
                section: 'patient',
                disabled : (this.action == 'view'),
                template: 'lite'
            };

            this.autoformTreatment = {
                entity: 'treatments',
                section: 'treatment',
                //formGroupClass: 'col-md-6',
                object: this.object,
                disabled : (this.action == 'view'),
                template: 'lite'
            };

            this.autoformDrugs = {
                entity: 'treatments',
                field: 'drugs',
                type: 'local',
                disabled : (this.action == 'view'),
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
                disabled : (this.action == 'view'),
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
                }).bind(this)
            };

            if(this.action !== 'add') {
                this.stateHistoryTable = {
                    entity: 'treatment-history',
                    field: 'history',
                    type: 'remote',
                    metadataFilters: 'field=history',
                    id: this.object._id
                };
                this.result= {};
                this.autoformResult = {
                    entity: 'treatment-history',
                    type: 'local',
                    section: 'form',
                    template: 'full',
                    metadataFilters: 'field=history',
                    inputIcons : true,
                    object: this.result,
                    field: 'history',
                    addEvent: (function() {
                        this.$http.put('/api/treatments/' + this.object._id + '/status', this.result.aux.history.state).then(treatment => {
                                this.$http.put('/api/treatment-history/' + this.object._id, this.result.aux.history).then(() => {
                                        this.ngToast.create('Estado seteado con éxito!');
                                        this.$state.go('treatments');
                                    })
                                    .catch(err => {
                                        this.handleError(err);
                                        this.autoformResult.resetForm();
                                    });
                            })
                            .catch(err => {
                                this.handleError(err);
                                this.autoformResult.resetForm();
                            });
                    }).bind(this)
                };
            }
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
                    this.object.state = 'EA';
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
                    className: 'danger',
                    content: (err.message) ? err.message : err.data
                });
            }
        }

    }

    angular.module('sacpApp')
        .component('treatments', {
            templateUrl: 'app/treatments/treatments.html',
            controller: TreatmentsComponent,
            controllerAs: 'vm'
        });

})();
