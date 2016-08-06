'use strict';

class SignupController {
    //start-non-standard
    user = {};
    errors = {};
    success = false;
    submitted = false;
    isSaving = false;
    //end-non-standard

    constructor(Auth, $state) {
        this.Auth = Auth;
        this.$state = $state;
    }

    register(form) {
        this.isSaving = true;
        this.submitted = true;
        if (form.$valid) {
            this.Auth.createUser({
                    name: this.user.name,
                    email: this.user.email,
                    password: this.user.password,
                    mn: this.user.mn,
                    mp: this.user.mp
                })
                .then(() => {
                    // Show success alert
                    this.success = true;
                    this.isSaving = false;
                })
                .catch(err => {
                    err = err.data;
                    this.errors = {};
                    this.isSaving = false;

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, (error, field) => {
                        form[field].$setValidity('mongoose', false);
                        this.errors[field] = error.message;
                    });
                }).finally(function () {
                    this.isSaving = false;
                });
        }
    }
}

angular.module('sacpApp')
    .controller('SignupController', SignupController);
