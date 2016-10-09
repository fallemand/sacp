'use strict';

class DrugPresentationsController {

    constructor() {
        this.showForm = false;
        this.user =
        this.table;
        this.object = {};

        this.table = {
            entity: 'drug-presentations',
            type: 'remote',
            canFilter : true,
            actions: ['view', 'modify', 'delete'],
            modifyEvent: (function (object) {
                this.autoform.disabled = false;
                this.showForm = true;
                this.object = object;
            }).bind(this),
            viewEvent: (function (object) {
                this.object = object;
                this.showForm = true;
                this.autoform.disabled = true;
            }).bind(this)
        };

        this.autoform = {
            entity : 'drug-presentations',
            formGroupClass : 'col-md-3',
            template : 'short',
            inputIcons : true,
            resetEvent: (function() {
                this.showForm = false;
            }).bind(this),
            reloadEvent: (function() {
                this.table.ngtable.reload();
            }).bind(this)
        };
    }

    toggleForm() {
        if (this.showForm) {
            this.showForm = false;
        }
        else {
            this.autoform.resetForm();
            this.autoform.disabled = false;
            this.showForm = true;
        }
    }
}

angular.module('sacpApp')
    .controller('DrugPresentationsController', DrugPresentationsController);
