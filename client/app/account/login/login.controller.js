'use strict';

class LoginController {
    constructor(Auth, $state, $stateParams) {
        this.user = {};
        this.errors = {};
        this.submitted = false;
        this.$stateParams = $stateParams;
        this.Auth = Auth;
        this.$state = $state;
    }

    login(form) {
        this.submitted = true;

        if (form.$valid) {
            this.Auth.login({
                    email: this.user.email,
                    password: this.user.password
                })
                .then(user => {
                    //If there is return State send to that
                    if (this.$stateParams.returnState) {
                        this.$state.go(this.$stateParams.returnState, this.$stateParams.returnParams);
                    }
                    else {
                        // Logged in, redirect to home
                        if (user.role === 'admin') {
                            this.$state.go('home');
                        }
                        else {
                            this.$state.go('treatments');
                        }
                    }
                })
                .catch(err => {
                    this.errors.other = err.message;
                });
        }
    }
}

angular.module('sacpApp')
    .controller('LoginController', LoginController);
