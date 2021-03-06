'use strict';

class NavbarController {
    constructor(Auth, $http) {
        this.isLoggedIn = Auth.isLoggedIn();
        this.isAdmin = Auth.isAdmin();
        this.getCurrentUser = Auth.getCurrentUser();

        if(this.isLoggedIn) {
            var filter = encodeURIComponent('{"or":"[state=PA&state=EE&state=EA]"}');
            if(this.isAdmin) {
                $http.get('/api/treatments?filter=' + filter).then(response => {
                    this.pendingTreatments = response.data;
                });
            }
            else {
                $http.get('/api/treatments/mine?filter=' + filter).then(response => {
                    this.pendingTreatments = response.data;
                });
            }
        }
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
