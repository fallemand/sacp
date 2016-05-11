'use strict';

class PatientsController {


    constructor($http, ngToast) {
        this.showPatientForm = false;
        this.newPatient = {};
        this.errors = {};
        this.submitted = false;
        this.$http = $http;
        this.ngToast = ngToast;
        this.patientsTable;

        this.patientsTableParamenters = {
            entity: 'patients',
            actions: ['view', 'modify', 'delete'],
            initEvent: (function (table) {
                this.patientsTable = table;
            }).bind(this),
            reloadEvent: (function () {
                this.patientsTable.reload();
            }).bind(this)
        };
    }

    addPatient(form) {
        this.submitted = true;

        if (form.$valid) {
            this.add();
        }
    }

    add() {
        this.$http.post('/api/patients', {
            name: this.patient.name,
            email: this.patient.email,
            dni: this.patient.dni,
            socialInsuranceNumber: this.patient.socialInsuranceNumber,
            address: this.patient.address,
            phone: this.patient.phone,
            cellphone: this.patient.cellphone,
            agreementType: this.patient.agreementType
        }).then(() => {
                this.patientsTable.reload();
                this.ngToast.create('Paciente agregado con éxito!');
            })
            .catch(err => {
                err = err.data;
                angular.forEach(err.errors, (error, field) => {
                    this.ngToast.create({
                        className: 'danger',
                        content: error.message
                    });
                });
            }).finally(function () {
            this.isSaving = false;
        });
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
