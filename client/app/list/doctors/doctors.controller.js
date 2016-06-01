'use strict';

class DoctorsController {

    constructor($http) {
        this.$http = $http;
        this.countNotActiveUsers;

        this.patientsTable = {
            entity: 'patients',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            modifyEvent: (function (object) {
                this.showPatientForm = true;
                this.object = object;
            }).bind(this)
        };

        this.activeDoctorsTable = {
            entity: 'users',
            filters: 'active=true&&role=user',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            reloadEvent : (function() {
                this.activeDoctorsTable.ngtable.reload();
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
