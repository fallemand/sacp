'use strict';

class DoctorsController {

    constructor($http, NgTableParams, sweet) {
        this.$http = $http;
        this.sweet = sweet;

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
        this.sweet.show({
            title: '¿Está Seguro?',
            text: 'Eliminará el usuario ' + user.name,
            type: 'error',
            showCancelButton: true,
            confirmButtonClass: 'btn-danger',
            confirmButtonText: 'Sí, eliminarlo!',
            closeOnConfirm: false
        }, (function() {
            this.$http.delete('/api/users/' + user._id);
            this.notActiveDoctorsTable.reload();
            this.sweet.show('Eliminado!', 'El usuario ha sido eliminado.', 'success');
        }).bind(this));
    }

    activateUser(user) {
        this.sweet.show({
            title: '¿Está Seguro?',
            text: 'Activará el usuario ' + user.name,
            type: 'info',
            showCancelButton: true,
            confirmButtonClass: 'btn-success',
            confirmButtonText: 'Sí, activarlo!',
            closeOnConfirm: false
        }, (function() {
            this.$http.put('/api/users/' + user._id + '/activate');
            this.notActiveDoctorsTable.reload();
            this.sweet.show('Activado!', 'El usuario ha sido activado.', 'success');
        }).bind(this));
    }
}

angular.module('sacpApp')
    .controller('DoctorsController', DoctorsController);
