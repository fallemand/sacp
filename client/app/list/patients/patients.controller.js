'use strict';

class PatientsController {


    constructor($http, ngToast) {
        this.showPatientForm = false;
        this.patient = {};
        this.submitted = false;
        this.$http = $http;
        this.ngToast = ngToast;
        this.patientsTable;
        this.isSaving = false;

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
            this.isSaving = true;
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
                    this.resetForm(form);
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
    }

    cancel(form) {
        this.showPatientForm = false;
        this.resetForm(form);
    }

    resetForm(form) {
        this.submitted = false;
        this.patient = {
            name : '',
            email: '',
            dni: '',
            socialInsuranceNumber: '',
            address: '',
            phone: '',
            cellphone: '',
            agreementType: ''
        };
        form.$setPristine();
        form.$setUntouched();
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
