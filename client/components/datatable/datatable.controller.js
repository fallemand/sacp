'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams, $compile, sweet) {
            this.sweet = sweet;
            this.$compile = $compile;
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.$http = $http;
            $http.get('/api/' + this.parameters.entity + '/metadata').then(response => {
                this.metadata = response.data;
                this.cols = this.generateColsList(this.metadata, this.parameters, this.$compile);
                this.loadedData = true;
            });
            this.tableParams = new NgTableParams({}, {
                getData: (function ($defer, params) {
                    $http.get('/api/' + this.parameters.entity + '?' + this.parameters.filters).then(response => {
                        $defer.resolve(response.data);
                        if(this.parameters.initEvent) {
                            this.parameters.initEvent(this.tableParams);
                        }
                    });
                }).bind(this)
            });
        }

        generateColsList(metadata, parameters, $compile) {
            var cols = [];
            var actionsCol = {
                field: '_id',
                title: 'Acciones',
                show: 'true',
                filter: { 'name' : "text" },
                getValue: this.actionsCol,
                actions: parameters.actions
            };
            cols.push(actionsCol);
            angular.forEach(metadata.fields, (value, field) => {
                var col = {
                    field: value.field,
                    title: value.title,
                    show: value.show,
                    filter: { 'name' : "text" },
                    getValue: this.htmlValue
                };
                cols.push(col);
            });
            return cols;
        }

        htmlValue($scope, row) {
            var value = row[this.field];
            return value;
        }

        actionsCol($scope, row) {
            var html = '' ;
            angular.forEach(this.actions, (value, index) => {
                switch(value) {
                    case 'activate' :
                        html += '<a class="btn btn-xs btn-success" ng-click="vm.activate(row)" ><i class="fa fa-check-square"></i> Activar</a>'; break;
                    case 'delete' :
                        html += '<a class="btn btn-xs btn-danger" ng-click="vm.delete(row)"><i class="fa fa-times"></i>Cancelar</a>'; break;
                }
            });
            return html;
        }

        delete(user) {
            this.sweet.show({
                title: '¿Está Seguro?',
                text: 'Eliminará el ' + this.metadata.name + ' ' + user.name,
                type: 'error',
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'Sí, eliminarlo!',
                closeOnConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            }, (function() {
                this.$http.delete('/api/users/' + user._id).then(response => {
                    if(this.parameters.reloadEvent) {
                        this.parameters.reloadEvent(this.tableParams);
                    }
                    this.sweet.show({title: 'Eliminado!', text: 'El ' + this.metadata.name + ' ha sido eliminado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
                });
            }).bind(this));
        }

        activate(user) {
            this.sweet.show({
                title: '¿Está Seguro?',
                text: 'Activará el ' + this.metadata.name + ' ' + user.name,
                type: 'info',
                showCancelButton: true,
                confirmButtonClass: 'btn-success',
                confirmButtonText: 'Sí, activarlo!',
                closeOnConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            }, (function() {
                this.$http.put('/api/users/' + user._id + '/activate').then(response => {
                    if(this.parameters.reloadEvent) {
                        this.parameters.reloadEvent(this.tableParams);
                    }
                    this.sweet.show({title: 'Activado!', text: 'El ' + this.metadata.name + ' ha sido activado.', type: 'success', timer: '1300', allowOutsideClick: true, allowEscapeKey: true, showConfirmButton: false});
                });
            }).bind(this));
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
