'use strict';

class DoctorsController {

    constructor($http, NgTableParams) {
        this.$http = $http;
        this.data = [];
        this.tableParams = new NgTableParams({count: 2}, {
            getData: function ($defer, params) {
                $http.get('/api/users').then(response => {
                    $defer.resolve(response.data);
                });
            }
        });
    }

}

angular.module('sacpApp')
    .controller('DoctorsController', DoctorsController);
