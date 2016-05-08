'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams, $compile) {
            // Use the User $resource to fetch all users
            this.$compile = $compile;
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.$http = $http;
            $http.get('/api/' + this.parameters.entity + '/metadata').then(response => {
                this.metadata = response.data;
                this.cols = this.generateColsList(this.metadata, this.parameters, this.$compile);
                this.loadedData = true;
            });
            this.tableParams = new NgTableParams({count: 2}, {
                getData: (function ($defer, params) {
                    $http.get('/api/' + this.parameters.entity + '?' + this.parameters.filters).then(response => {
                        $defer.resolve(response.data);
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

        activate(id) {
            alert(id);
        }

        delete(id) {
            alert(id);
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
