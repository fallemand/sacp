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

        submit(form) {
            this.submitted = true;

            if (form.$valid) {
                this.isSaving = true;
                if(this.object._id) {
                    this.update(form);
                }
                else {
                    this.add(form);
                }

            }
        }

        add(form) {
            this.$http.post('/api/' + this.parameters.entity, this.object).then(() => {
                    this.parameters.saveFunction();
                    this.resetForm(form);
                    this.ngToast.create(this.metadata.name + ' agregado con éxito!');
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                }).finally(function () {
                this.isSaving = false;
            });
        }

        update(form) {
            this.$http.put('/api/' + this.parameters.entity + '/' + this.object._id, this.object).then(() => {
                    this.parameters.saveFunction();
                    this.resetForm(form);
                    this.ngToast.create(this.metadata.name + ' modificado con éxito!');
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                }).finally(function () {
                this.isSaving = false;
            });
        }

        resetForm(form) {
            this.submitted = false;
            angular.forEach(this.object, function (value, key) {
                value = '';
            });
            form.$setPristine();
            form.$setUntouched();
        }

        loadData(field, api) {
            this.$http.get('/api/' + api)
                .then(response => {
                    this[field] = response.data;
                    this.object[field] = this[field][0];
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
