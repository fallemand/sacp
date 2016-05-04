'use strict';

class DoctorsController {

    constructor($http, NgTableParams, sweet) {
        this.$http = $http;
        this.sweet = sweet;
        this.countNotActiveUsers;

        this.activeDoctorsTable = new NgTableParams({}, {
            getData: function ($defer, params) {
                $http.get('/api/users?active=true&&role=user').then(response => {
                    $defer.resolve(response.data);
                });
            }
        });

        this.notActiveDoctorsTable = new NgTableParams({}, {
            getData: (function ($defer, params) {
                $http.get('/api/users?active=false&&role=user').then(response => {
                    this.countNotActiveUsers = response.data.length;
                    $defer.resolve(response.data);
                });
            }).bind(this)
        });
    }

    updateData() {
        this.notActiveDoctorsTable.reload();
        this.activeDoctorsTable.reload();
        this.countList();
    }

    countList() {
        this.$http.get('/api/users/count?active=false&&role=user').then(response => {
            this.countNotActiveUsers = response.data;
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
            closeOnConfirm: false,
            allowEscapeKey: true,
            allowOutsideClick: true
        }, (function() {
            this.$http.delete('/api/users/' + user._id).then(response => {
                this.updateData();
                this.sweet.show({title: 'Eliminado!', text: 'El usuario ha sido eliminado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
            });
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
            closeOnConfirm: false,
            allowEscapeKey: true,
            allowOutsideClick: true
        }, (function() {
            this.$http.put('/api/users/' + user._id + '/activate').then(response => {
                this.updateData();
                this.sweet.show({title: 'Activado!', text: 'El usuario ha sido activado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
            });
        }).bind(this));
    }
}

angular.module('sacpApp')
    .controller('DoctorsController', DoctorsController);
