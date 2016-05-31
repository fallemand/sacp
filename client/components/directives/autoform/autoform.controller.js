'use strict';

(function () {

    class AutoFormController {
        constructor($scope, $http, ngToast) {
            this.$scope = $scope;
            this.autoform = $scope.parameters;
            this.autoform.isSaving = false;
            this.autoform.submitted = false;
            this.$http = $http;
            this.errors = {};
            this.typeahead = {};
            this.ngToast = ngToast;
            $http.get('/api/' + this.autoform.entity + '/metadata')
                .then(response => {
                    this.loadedData = true;
                    this.loadAutoForm();
                    this.metadata = response.data;
                    if(this.autoform.section) {
                        this.metadata.fields = this.getSectionFields();
                    }
                })
                .catch(err => {
                    ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }

        getSectionFields() {
            var metadataFields = this.metadata.fields;
            var sectionFields = this.metadata.sections[this.autoform.section].fields;
            var fields = [];
            angular.forEach(metadataFields, (value) => {
                if(sectionFields.indexOf(value.field) > -1 ) {
                    fields.push(value);
                }
            });
            if(fields[0].controlType == 'list') {
                this.list = true;
                this.listfield = 'drugsaux';
                return fields[0].fields;
            }
            return fields;
        }

        loadAutoForm() {
            this.autoform.submit = (function() {
                this.submit();
            }).bind(this);
            this.autoform.resetForm = (function() {
                this.resetForm();
            }).bind(this);
        }

        getMessage(key, value, field) {
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
                case 'editable' :
                    return 'Sin resultados';
                case 'mongoose' :
                    return this.errors[field];
            }
        }

        submit() {
            this.autoform.submitted = true;

            if (this.autoform.form.$valid) {
                this.autoform.isSaving = true;
                if (this.$scope.object._id) {
                    this.update();
                }
                else {
                    this.add();
                }

            }
        }

        add() {
            if (!this.list) {
                this.$http.post('/api/' + this.autoform.entity, this.$scope.object).then(() => {
                        this.resetForm();
                        this.ngToast.create(this.metadata.name + ' agregado con éxito!');
                        this.autoform.reloadEvent();
                    })
                    .catch(err => {
                        this.handleError(err);
                    });
            }
            else {
                if(!this.$scope.object['drugs']) {
                    this.$scope.object['drugs'] = [];
                }
                this.$scope.object['drugs'].push(this.$scope.object['drugs' + 'aux']);
                this.resetForm();
            }
        }

        update() {
            //Fix sub-object changes
            for (var attribute in this.$scope.object) {
                if (this.$scope.object[attribute].hasOwnProperty('_id')) {
                    this.$scope.object[attribute] = this.$scope.object[attribute]._id;
                }
            }
            this.$http.put('/api/' + this.autoform.entity + '/' + this.$scope.object._id, this.$scope.object).then(() => {
                    this.resetForm();
                    this.ngToast.create(this.metadata.name + ' modificado con éxito!');
                    this.autoform.reloadEvent();
                })
                .catch(err => {
                    this.handleError(err);
                });
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

        resetForm() {
            this.autoform.submitted = false;
            this.autoform.isSaving = false;
            this.$scope.object = angular.copy({});
            this.autoform.form.$setPristine();
            this.autoform.form.$setUntouched();
            if(this.autoform.resetEvent) {
                this.autoform.resetEvent();
            }
        }

        loadData(field, api) {
            this.$http.get('/api/' + api)
                .then(response => {
                    this[field] = response.data;
                    this.$scope.object[field] = "";
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }

        loadTypeAhead(api, viewvalue, searchField) {
            return this.$http.get('/api/' + api + '?' + searchField + '=^' + viewvalue)
                .then(response => {
                    return response.data;
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
