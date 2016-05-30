'use strict';

class PatientsController {

    constructor($http, ngToast) {
        this.showPatientForm = false;
        this.patientsTable;
        this.object = {};

        this.patientsTableParamenters = {
            entity: 'patients',
            actions: ['view', 'modify', 'delete'],
            initEvent: (function (table) {
                this.patientsTable = table;
            }).bind(this),
            reloadEvent: (function () {
                this.patientsTable.reload();
            }).bind(this),
            modifyEvent: (function (object) {
                this.showPatientForm = true;
                this.object = object;
                this.showPatientForm = true;
            }).bind(this)
        };

        this.autoform = {
            entity : 'patients',
            formGroupClass : 'col-md-3',
            template : 'short',
            inputIcons : true,
            resetEvent: (function() {
                this.showPatientForm = false;
            }).bind(this),
            reloadEvent: (function() {
                this.patientsTable.reload();
            }).bind(this)
        };
    }

    togglePatientForm() {
        if (this.showPatientForm) {
            this.showPatientForm = false;
        }
        else {
            this.showPatientForm = true;
        }
    }
}

angular.module('sacpApp')
    .controller('PatientsController', PatientsController);
