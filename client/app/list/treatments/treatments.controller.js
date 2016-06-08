'use strict';

class TreatmentsController {
    constructor($state) {
        this.$state = $state;
        this.treatmentsTable = {
            entity: 'treatments',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            viewEvent: (function (object) {
                this.$state.go('add', {'id' : object._id});
            }).bind(this),
            modifyEvent: (function (object) {
                this.showPatientForm = true;
                this.object = object;
            }).bind(this)
        };
    }
}

angular.module('sacpApp')
    .controller('TreatmentsController', TreatmentsController);
