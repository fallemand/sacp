'use strict';

class PatientsController {

    constructor($http, ngToast) {
        this.showPatientForm = false;
        this.patientsTable;
        this.object = {};

        this.patientsTable = {
            entity: 'patients',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            modifyEvent: (function (object) {
                this.autoform.disabled = false;
                this.showPatientForm = true;
                this.object = object;
            }).bind(this),
            viewEvent: (function (object) {
                this.object = object;
                this.showPatientForm = true;
                this.autoform.disabled = true;
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
                this.patientsTable.ngtable.reload();
            }).bind(this)
        };
    }

    togglePatientForm() {
        if (this.showPatientForm) {
            this.showPatientForm = false;
        }
        else {
            this.autoform.resetForm();
            this.autoform.disabled = false;
            this.showPatientForm = true;
        }
    }
}

angular.module('sacpApp')
    .controller('PatientsController', PatientsController);
