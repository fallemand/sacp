'use strict';

class DrugsController {

    constructor() {
        this.showForm = false;
        this.user =
        this.table;
        this.object = {};

        this.table = {
            entity: 'drugs',
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
            entity : 'drugs',
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
    .controller('DrugsController', DrugsController);
