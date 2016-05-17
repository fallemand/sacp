'use strict';

(function () {

    class AutoFormController {
        constructor($scope, $http, ngToast) {
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.isSaving = false;
            this.submitted = false;
            this.$http = $http;
            this.ngToast = ngToast;
            this.object = {};
            $http.get('/api/' + this.parameters.entity + '/metadata')
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
                if (this.object._id) {
                    this.update();
                }
                else {
                    this.add();
                }

            }
        }

        add() {
            this.$http.post('/api/' + this.parameters.entity, this.object).then(() => {
                    this.resetForm();
                    this.ngToast.create(this.metadata.name + ' agregado con éxito!');
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
            this.$http.put('/api/' + this.parameters.entity + '/' + this.object._id, this.object).then(() => {
                    this.resetForm();
                    this.ngToast.create(this.metadata.name + ' modificado con éxito!');
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
            this.object = angular.copy({});
            this.form.$setPristine();
            this.form.$setUntouched();
        }

        loadData(field, api) {
            this.$http.get('/api/' + api)
                .then(response => {
                    this[field] = response.data;
                    this.object[field] = "";
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
