'use strict';

class PatientsController {

    constructor($http, ngToast, Auth) {
        this.showPatientForm = false;
        this.user =
        this.patientsTable;
        this.object = {};

        this.patientsTable = {
            entity: 'patients',
            type: 'remote',
            canFilter : true,
            actions: ['view', 'modify', 'delete'],
            privileges: {
                user: {
                    actions: ['view', 'modify', 'delete'],
                    list: 'mine'
                },
                admin: {actions: ['view', 'modify', 'delete']}
            },
            // customActions: {
            //     'modify' : function(row) {
            //         var currentUser = Auth.getCurrentUser();
            //         return (currentUser.role === 'admin' || row.registeredBy._id === currentUser._id) ? '<a class="btn btn-xs btn-default" ng-click="vm.update(row)" uib-tooltip="Modificar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-pencil"></i></a>' : '';
            //     }
            // },
            modifyEvent: (function (object) {
                this.autoform.disabled = false;
                this.showPatientForm = true;
                this.object = object;
            }).bind(this),
            viewEvent: (function (object) {
                this.object = object;
                this.showPatientForm = true;
                this.autoform.disabled = true;
            }).bind(this)
        };

        this.autoform = {
            entity : 'patients',
            formGroupClass : 'col-md-3',
            template : 'short',
            inputIcons : true,
            resetEvent: (function() {
                this.showPatientForm = false;
            }).bind(this),
            reloadEvent: (function() {
                this.patientsTable.ngtable.reload();
            }).bind(this)
        };
    }

    togglePatientForm() {
        if (this.showPatientForm) {
            this.showPatientForm = false;
        }
        else {
            this.autoform.resetForm();
            this.autoform.disabled = false;
            this.showPatientForm = true;
        }
    }
}

angular.module('sacpApp')
    .controller('PatientsController', PatientsController);
