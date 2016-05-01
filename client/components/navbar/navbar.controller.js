'use strict';

class NavbarController {
    constructor(Auth) {
        this.isLoggedIn = Auth.isLoggedIn;
        this.isAdmin = Auth.isAdmin;
        this.getCurrentUser = Auth.getCurrentUser;
    }

    toggleMainNav() {
        if($('#container').hasClass('mainnav-lg')) {
            $('#container').removeClass('mainnav-lg');
        }
        else {
            $('#container').addClass('mainnav-lg');
        }
    }

}

angular.module('sacpApp')
    .controller('NavbarController', NavbarController);
