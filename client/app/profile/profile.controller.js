'use strict';
(function () {

    class ProfileComponent {
        constructor($http, ngToast, $state) {
            this.$http = $http;
            this.$state = $state;
            this.ngToast = ngToast;
            this.entity = $state.params.type;
            this.id = $state.params.id;
            this.getEntity(this.entity, this.id, function(response) {
                this.object = response.data;
            });
            this.treatmentsTable = {
                entity: 'treatments',
                type: 'remote',
                actions: ['view'],
                privileges: {
                    user: {
                        actions: ['view', 'modify', 'delete'],
                        list: 'mine'
                    },
                    admin: {actions: ['view', 'view-prescription']}
                },
                customActions: {
                    'modify' : function(row) {
                        return (row.state._id !== 'AP') ? '<a class="btn btn-xs btn-default" ng-click="vm.update(row)" uib-tooltip="Modificar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-pencil"></i></a>' : '';
                    },
                    'delete' : function(row) {
                        return (row.state._id !== 'AP') ? '<a class="btn btn-xs btn-default" ng-click="vm.delete(row)" uib-tooltip="Eliminar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-times"></i></a>' : '';
                    },
                    'view-prescription' : function(row) {
                        return (row.state._id === 'AP') ? '<a class="btn btn-xs btn-success" href="/prescription/' + row._id + '" ui-sref="prescription({ id : \'' + row._id + '\'})" uib-tooltip="Ver Receta" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-navicon"></i></a>' : '';
                    }
                },
                viewEvent: (function (object) {
                    this.$state.go('treatments.view', {'id' : object._id});
                }).bind(this),
                modifyEvent: (function (object) {
                    this.$state.go('treatments.action', {'action': 'update', 'id' : object._id});
                }).bind(this)
            };
        }

        getEntity(entity, id, callback) {
            this.$http.get('/api/treatments/'+id)
                .then(response => {
                    if(callback) {
                        callback(response);
                    }
                })
                .catch(err => {
                    if(err.data && err.data.name == 'CastError') {
                        err.message = 'El parametro no es correcto';
                    }
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }
    }

    angular.module('sacpApp')
        .component('profile', {
            templateUrl: 'app/profile/profile.html',
            controller: ProfileComponent,
            controllerAs: 'vm'
        });
})();
