'use strict';

(function () {

    class AutoFormController {
        constructor($scope, $http, ngToast) {
            this.$scope = $scope;
            this.autoform = $scope.parameters;
            this.loadAutoForm();
            this.isSaving = false;
            this.submitted = false;
            this.$http = $http;
            this.ngToast = ngToast;
            $http.get('/api/' + this.autoform.entity + '/metadata')
                .then(response => {
                    this.metadata = response.data;
                    this.loadedData = true;
                })
                .catch(err => {
                    ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }

        loadAutoForm() {
            this.autoform.form = this.form;
            this.autoform.isSaving = this.isSaving;
            this.autoform.submitted = this.submitted;
            this.autoform.object = (this.autoform.object) ? this.autoform.object : {};
            this.autoform.submit = (function() {
                this.submit();
            }).bind(this);
            this.autoform.resetForm = (function() {
                this.resetForm();
            }).bind(this);
        }

        getMessage(key, value) {
            switch (key) {
                case 'required' :
                    return 'El campo es requerido';
                case 'max' :
                    return 'El valor máximo es ' + value;
                case 'min' :
                    return 'El valor mínimo es ' + value;
                case 'maxlength' :
                    return 'Máximo ' + value + ' caracteres';
                case 'minlength' :
                    return 'Mínimo ' + value + ' caracteres';
                case 'email' :
                    return 'No parece un Email válido';
                case 'number' :
                    return 'No parece un número válido';
            }
        }

        submit() {
            this.submitted = true;

            if (this.form.$valid) {
                this.isSaving = true;
                if (this.autoform.object._id) {
                    this.update();
                }
                else {
                    this.add();
                }

            }
        }

        add() {
            this.$http.post('/api/' + this.autoform.entity, this.autoform.object).then(() => {
                    this.resetForm();
                    this.ngToast.create(this.metadata.name + ' agregado con éxito!');
                    this.autoform.reloadEvent();
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        this.form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                })
                .finally(function () {
                    this.isSaving = false;
                });
        }

        update() {
            //Fix sub-object changes
            for (var attribute in this.autoform.object) {
                if (this.autoform.object[attribute].hasOwnProperty('_id')) {
                    this.autoform.object[attribute] = this.autoform.object[attribute]._id;
                }
            }
            this.$http.put('/api/' + this.autoform.entity + '/' + this.autoform.object._id, this.autoform.object).then(() => {
                    this.resetForm();
                    this.ngToast.create(this.metadata.name + ' modificado con éxito!');
                    this.autoform.reloadEvent();
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        this.form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                }).finally(function () {
                this.isSaving = false;
            });
        }

        resetForm() {
            this.submitted = false;
            this.isSaving = false;
            this.autoform.object = angular.copy({});
            this.form.$setPristine();
            this.form.$setUntouched();
            if(this.autoform.resetEvent) {
                this.autoform.resetEvent();
            }
        }

        loadData(field, api) {
            this.$http.get('/api/' + api)
                .then(response => {
                    this[field] = response.data;
                    this.autoform.object[field] = "";
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }
    }

    angular.module('sacpApp.admin')
        .controller('AutoFormController', AutoFormController);

})();
