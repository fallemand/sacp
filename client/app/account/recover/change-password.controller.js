'use strict';

class ChangePasswordController {
    constructor($http, Auth, $state, $stateParams) {
        this.email;
        this.error;
        this.submitted = false;
        this.$stateParams = $stateParams;
        this.Auth = Auth;
        this.$state = $state;
        this.$http = $http;
    }

    recover(form) {
        this.submitted = true;
        this.error = '';

        if (form.$valid) {
            this.$http.post('/api/users/recover', {email: this.email})
                .then(response => {
                    this.success = true;
                })
                .catch(err => {
                    this.error = err.data.message;
                });
        }
    }
}

angular.module('sacpApp')
    .controller('ChangePasswordController', ChangePasswordController);
