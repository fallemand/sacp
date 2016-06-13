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
