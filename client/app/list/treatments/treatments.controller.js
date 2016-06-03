'use strict';

class TreatmentsController {
    constructor() {
        this.treatmentsTable = {
            entity: 'treatments',
            type: 'remote',
            actions: ['view', 'modify', 'delete'],
            modifyEvent: (function (object) {
                this.showPatientForm = true;
                this.object = object;
            }).bind(this)
        };
    }
}

angular.module('sacpApp')
    .controller('TreatmentsController', TreatmentsController);
