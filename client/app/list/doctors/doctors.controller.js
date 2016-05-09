'use strict';

class DoctorsController {

    constructor($http, NgTableParams, sweet) {
        this.$http = $http;
        this.sweet = sweet;
        this.countNotActiveUsers;

        this.activeDoctorsTable = {
            entity: 'users',
            filters: 'active=true&&role=user',

        };

        this.notActiveDoctorsTable = {
            entity: 'users',
            filters: 'active=false&&role=user',
            actions: ['activate', 'delete'],
            reloadEvent : (function(table) {
                table.reload();
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
