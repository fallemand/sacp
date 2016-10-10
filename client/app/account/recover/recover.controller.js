'use strict';

class RecoverController {
    constructor($http) {
        this.email;
        this.error;
        this.submitted = false;
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
    .controller('RecoverController', RecoverController);
