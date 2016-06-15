'use strict';

class TreatmentsController {
    constructor($state) {
        this.$state = $state;
        this.treatmentsTable = {
            entity: 'treatments',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            privileges: {
                user: ['view', 'modify', 'delete'],
                admin: ['view', 'delete']
            },
            customActions: {
                'view-prescription' : function(row) {
                    if(row.state._id === 'AP') {
                        return '<a class="btn btn-xs btn-success" href="/prescription/' + row._id + '" ui-sref="prescription({ id : ' + row._id + '})" uib-tooltip="Ver Receta" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-navicon"></i></a>';
                    }
                    return '';
                }
            },
            viewEvent: (function (object) {
                this.$state.go('treatments.action', {'action': 'view', 'id' : object._id});
            }).bind(this),
            modifyEvent: (function (object) {
                this.$state.go('treatments.action', {'action': 'update', 'id' : object._id});
            }).bind(this)
        };
    }
}

angular.module('sacpApp')
    .controller('TreatmentsController', TreatmentsController);
