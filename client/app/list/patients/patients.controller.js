'use strict';

class PatientsController {


    constructor($http, sweet) {
        this.showPatientForm = false;
        this.newPatient = {};
        this.errors = {};
        this.submitted = false;
    }

    addPatient(form) {
        this.submitted = true;

        if (form.$valid) {
            this.$http.post('/api/patients', { name: this.newPatient })
                .then(() => {
                    // Show success alert
                    this.success = true;
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                });
        }
    }


    togglePatientForm() {
        if(this.showPatientForm) {
            this.showPatientForm = false;
        }
        else {
            this.showPatientForm = true;
        }
    }
}

angular.module('sacpApp')
    .controller('PatientsController', PatientsController);
