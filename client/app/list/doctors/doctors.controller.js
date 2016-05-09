'use strict';

class DoctorsController {

    constructor($http, NgTableParams, sweet) {
        this.$http = $http;
        this.sweet = sweet;
        this.countNotActiveUsers;
        this.activeDoctorsTable;
        this.notActiveDoctorsTable;

        this.activeDoctorsTableParameters = {
            entity: 'users',
            filters: 'active=true&&role=user',
            initEvent : (function(table) {
                this.activeDoctorsTable = table;
            }).bind(this)

        };

        this.notActiveDoctorsTableParameters = {
            entity: 'users',
            filters: 'active=false&&role=user',
            actions: ['activate', 'delete'],
            reloadEvent : (function(table) {
                this.countList();
                table.reload();
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
