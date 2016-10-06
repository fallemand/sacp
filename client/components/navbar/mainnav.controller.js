'use strict';

class MainNavController {
    constructor(Auth) {
        this.isLoggedIn = Auth.isLoggedIn();
        this.isAdmin = Auth.isAdmin();
        this.getCurrentUser = Auth.getCurrentUser();
    }
}

angular.module('sacpApp')
    .controller('MainNavController', MainNavController);
