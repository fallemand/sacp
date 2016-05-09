'use strict';

class DoctorsController {

    constructor($http) {
        this.$http = $http;
        this.countNotActiveUsers;
        this.activeDoctorsTable;
        this.notActiveDoctorsTable;

        this.activeDoctorsTableParameters = {
            entity: 'users',
            filters: 'active=true&&role=user',
            actions: ['view', 'modify', 'delete'],
            initEvent : (function(table) {
                this.activeDoctorsTable = table;
            }).bind(this),
            reloadEvent : (function() {
                this.activeDoctorsTable.reload();
            }).bind(this)

        };

        this.notActiveDoctorsTableParameters = {
            entity: 'users',
            filters: 'active=false&&role=user',
            actions: ['activate', 'cancel'],
            reloadEvent : (function() {
                this.countList();
                this.notActiveDoctorsTable.reload();
                this.activeDoctorsTable.reload();
            }).bind(this),
            initEvent : (function(table) {
                this.countList();
                this.notActiveDoctorsTable = table;
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
