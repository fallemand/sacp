'use strict';

class DoctorsController {

    constructor($http) {
        this.$http = $http;
        this.countNotActiveUsers;
        this.showDoctorForm = false;
        this.patientsTable;
        this.object = {};

        this.autoform = {
            entity : 'users',
            formGroupClass : 'col-md-4',
            template : 'short',
            inputIcons : true,
            resetEvent: (function() {
                this.showDoctorForm = false;
            }).bind(this),
            reloadEvent: (function() {
                this.activeDoctorsTable.ngtable.reload();
            }).bind(this)
        };

        this.activeDoctorsTable = {
            entity: 'users',
            filters: 'active=true&&role=user',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            reloadEvent : (function() {
                this.activeDoctorsTable.ngtable.reload();
            }).bind(this),
            modifyEvent: (function (object) {
                this.object = object;
                this.autoform.resetForm();
                this.autoform.disabled = false;
                this.showDoctorForm = true;

            }).bind(this),
            viewEvent: (function (object) {
                this.object = object;
                this.autoform.resetForm();
                this.autoform.disabled = true;
                this.showDoctorForm = true;
            }).bind(this)

        };

        this.notActiveDoctorsTable = {
            entity: 'users',
            filters: 'active=false&&role=user',
            type: 'remote',
            actions: ['activate', 'cancel'],
            reloadEvent : (function() {
                this.countList();
                this.notActiveDoctorsTable.ngtable.reload();
                this.activeDoctorsTable.ngtable.reload();
            }).bind(this),
            initEvent : (function() {
                this.countList();
            }).bind(this)
        };
    }

    countList() {
        this.$http.get('/api/users/count?active=false&&role=user').then(response => {
            this.countNotActiveUsers = response.data;
        });
    }
}

angular.module('sacpApp')
    .controller('DoctorsController', DoctorsController);
