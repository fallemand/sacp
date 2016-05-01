'use strict';

class DoctorsController {

    constructor($http, NgTableParams) {
        this.$http = $http;

        this.activeDoctorsTable = new NgTableParams({count: 2}, {
            getData: function ($defer, params) {
                $http.get('/api/users?active=true').then(response => {
                    $defer.resolve(response.data);
                });
            }
        });

        this.notActiveDoctorsTable = new NgTableParams({count: 2}, {
            getData: function ($defer, params) {
                $http.get('/api/users?active=false').then(response => {
                    $defer.resolve(response.data);
                });
            }
        });
    }

    deleteUser(user) {
        this.$http.delete('/api/users/' + user._id);
        this.notActiveDoctorsTable.reload();
    }

    activateUser(user) {
        this.$http.put('/api/users/' + user._id + '/activate');
        this.notActiveDoctorsTable.reload();
    }

}

angular.module('sacpApp')
    .controller('DoctorsController', DoctorsController);
