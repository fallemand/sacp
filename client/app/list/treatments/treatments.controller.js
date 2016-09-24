'use strict';

class TreatmentsController {
    constructor($state, Auth) {
        this.isDoctor = (Auth.isUser() && !Auth.isAdmin());
        this.$state = $state;
        this.treatmentsTable = {
            entity: 'treatments',
            type: 'remote',
            actions: ['view'],
            privileges: {
                user: {
                    actions: ['view', 'modify'],
                    list: 'mine'
                },
                admin: {actions: ['view', 'view-prescription']}
            },
            customActions: {
                'modify' : function(row) {
                    return (row.state._id !== 'AP' && row.state._id !== 'CA') ? '<a class="btn btn-xs btn-default" ng-click="vm.update(row)" uib-tooltip="Modificar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-pencil"></i></a>' : '';
                },
                'delete' : function(row) {
                    return (row.state._id !== 'AP' && row.state._id !== 'CA') ? '<a class="btn btn-xs btn-default" ng-click="vm.delete(row)" uib-tooltip="Eliminar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-times"></i></a>' : '';
                },
                'view-prescription' : function(row) {
                    return (row.state._id === 'AP') ? '<a class="btn btn-xs btn-success" target="_blank" href="/api/reports/prescription/' + row._id + '" uib-tooltip="Ver Receta" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-navicon"></i></a>' : '';
                }
            },
            canFilter : true,
            viewEvent: (function (object) {
                this.$state.go('treatments.view', {'id' : object._id});
            }).bind(this),
            modifyEvent: (function (object) {
                this.$state.go('treatments.action', {'action': 'update', 'id' : object._id});
            }).bind(this)
        };
    }
}

angular.module('sacpApp')
    .controller('TreatmentsController', TreatmentsController);
