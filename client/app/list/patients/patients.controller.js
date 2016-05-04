'use strict';

class PatientsController {


    constructor(Auth, $state) {
        this.showPatientForm = false;
        this.user = {};
        this.errors = {};
        this.submitted = false;

        this.Auth = Auth;
        this.$state = $state;
    }

    addPatient() {
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
