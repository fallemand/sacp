'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams, sweet, Auth) {
            this.sweet = sweet;
            this.datatable = $scope.parameters;
            this.$http = $http;
            this.NgTableParams = NgTableParams;
            this.$scope = $scope;
            this.userType = (Auth.isAdmin()) ? 'admin' : 'user';
            this.getMetadata();
        }

        getMetadata() {
            var filters = (this.datatable.metadataFilters) ? '?' + this.datatable.metadataFilters : '';
            this.$http.get('/api/' + this.datatable.entity + '/metadata' + filters).then(response => {
                if (this.datatable.fields) {
                    var filteredFields = [];
                    for (var field in response.data.fields) {
                        if (this.datatable.fields.indexOf(response.data.fields[field].field) > -1) {
                            filteredFields.push(response.data.fields[field]);
                        }
                    }
                    response.data.fields = filteredFields;
                }
                var filteredFields = [];
                for (var field in response.data.fields) {
                    if (!response.data.fields[field].hideInList) {
                        filteredFields.push(response.data.fields[field]);
                    }
                }
                response.data.fields = filteredFields;
                this.metadata = response.data;
                this.cols = this.generateColsList();
                this.initialize();
            });
        }

        generateColsList() {
            var cols = [];
            if(this.datatable.actions && this.datatable.actions.length > 0) {
                var actionsCol = {
                    field: '_id',
                    title: 'Acciones',
                    show: 'true',
                    filter: {'name': "text"},
                    getValue: this.actionsCol,
                    actions: this.datatable.actions,
                    privileges: (this.datatable.privileges) ? this.datatable.privileges[this.userType] : undefined
                };
                cols.push(actionsCol);
            }
            angular.forEach(this.metadata.fields, (value, field) => {
                var col = {
                    field: value.field,
                    title: value.title,
                    show: value.show,
                    filter: {'name': "text"},
                    decorate: this.decorate,
                    decorator: value.decorator
                };
                switch (value.type) {
                    case 'text' :
                        col.getValue = this.htmlValue;
                        break;
                    case 'number' :
                        col.getValue = this.htmlValue;
                        break;
                    case 'select':
                        col.getValue = this.objectValue;
                        break;
                    case 'date':
                        col.getValue = this.dateValue;
                        break;
                    case 'typeahead':
                        col.getValue = this.objectValue;
                        break;
                    default:
                        col.getValue = this.htmlValue;
                        break;
                }
                cols.push(col);
            });
            return cols;
        }

        initialize() {
            this.loadedData = true;
            switch (this.datatable.type) {
                case 'remote' :
                    this.datatable.ngtable = new this.NgTableParams({}, {
                        getData: (function ($defer, params) {
                            var filters = (this.datatable.filters) ? '?' + this.datatable.filters : '';
                            var entityId = (this.datatable.id) ? '/' + this.datatable.id : '';
                            this.$http.get('/api/' + this.datatable.entity + entityId + filters).then(response => {
                                if(this.datatable.field) {
                                    response.data = response.data[this.datatable.field];
                                }
                                $defer.resolve(response.data);
                            });
                        }).bind(this)
                    });
                    break;
                case 'local' :
                    this.datatable.ngtable = new this.NgTableParams({
                        page: 1, // show first page
                        count: 10 // count per page
                    }, {
                        getData: (function ($defer, params) {
                                return this.$scope.object;
                        }).bind(this)
                    });
            }
            if (this.datatable.initEvent) {
                this.datatable.initEvent();
            }
        }

        htmlValue($scope, row) {
            var value = row;
            if(this.field.indexOf('.') > -1) {
                var paths = this.field.split(".");
                for(var path in paths) {
                    value = value[paths[path]];
                }
            }
            else {
                value = value[this.field];
            }
            if(this.decorator) {
                value = this.decorate(this.decorator, value)
            }
            return value;
        }

        dateValue($scope, row) {
            var value = row;
            if(this.field.indexOf('.') > -1) {
                var paths = this.field.split(".");
                for(var path in paths) {
                    value = value[paths[path]];
                }
            }
            else {
                value = value[this.field];
            }
            if(this.decorator) {
                value = this.decorate(this.decorator, value)
            }
            return new Date(value).toLocaleDateString();
        }

        objectValue($scope, row) {
            var value = row;
            if(this.field.indexOf('.') > -1) {
                var paths = this.field.split(".");
                for(var path in paths) {
                    value = value[paths[path]];
                }
            }
            else {
                value = value[this.field];
            }
            if(this.decorator) {
                return this.decorate(this.decorator, value.name)
            }
            return value.name;
        }

        actionsCol($scope, row) {
            var html = '<div class="btn-group">';
            angular.forEach(this.actions, (value, index) => {
                if(!this.privileges || this.privileges.indexOf(value) > -1) {
                    switch (value) {
                        case 'view' :
                            html += '<a class="btn btn-xs btn-default" ng-click="vm.view(row)" uib-tooltip="Ver" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-eye"></i></a>';
                            break;
                        case 'modify' :
                            html += '<a class="btn btn-xs btn-default" ng-click="vm.update(row)" uib-tooltip="Modificar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-pencil"></i></a>';
                            break;
                        case 'delete' :
                            html += '<a class="btn btn-xs btn-default" ng-click="vm.delete(row)" uib-tooltip="Eliminar" tooltip-placement="top" tooltip-append-to-body="true"><i class="fa fa-times"></i></a>';
                            break;
                        case 'activate' :
                            html += '<a class="btn btn-xs btn-success" ng-click="vm.activate(row)" ><i class="fa fa-check-square"></i> Activar</a>';
                            break;
                        case 'cancel' :
                            html += '<a class="btn btn-xs btn-danger" ng-click="vm.delete(row)"><i class="fa fa-times"></i>Cancelar</a>';
                            break;
                    }
                }
            });
            html += '</div>';
            return html;
        }

        decorate(decorator, value) {
            var html;
            switch(decorator.type) {
                case 'label' : html = '<span class="label ' + this.decorator.class[value] +'">' + value + '</span>';
                    break;
            }
            return html;
        }

        update(row) {
            if (this.datatable.modifyEvent) {
                this.datatable.modifyEvent(angular.copy(row));
            }
        }

        view(row) {
            if (this.datatable.viewEvent) {
                this.datatable.viewEvent(angular.copy(row));
            }
        }

        delete(object) {
            this.sweet.show({
                title: '¿Está Seguro?',
                text: 'Eliminará el ' + this.metadata.name + ' ' + object.name,
                type: 'error',
                showCancelButton: true,
                confirmButtonClass: 'btn-danger',
                confirmButtonText: 'Sí, eliminarlo!',
                closeOnConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            }, (function () {
                this.$http.delete('/api/' + this.datatable.entity + '/' + object._id).then(response => {
                    this.sweet.show({
                        title: 'Eliminado!',
                        text: 'El ' + this.metadata.name + ' ha sido eliminado.',
                        type: 'success',
                        timer: '1300',
                        allowOutsideClick: true,
                        allowEscapeKey: true,
                        showConfirmButton: false
                    });
                    this.datatable.ngtable.reload();
                    if (this.datatable.reloadEvent) {
                        this.datatable.reloadEvent();
                    }
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
            }, (function () {
                this.$http.put('/api/' + this.datatable.entity + '/' + user._id + '/activate').then(response => {
                    if (this.datatable.reloadEvent) {
                        this.datatable.reloadEvent();
                    }
                    this.sweet.show({
                        title: 'Activado!',
                        text: 'El ' + this.metadata.name + ' ha sido activado.',
                        type: 'success',
                        timer: '1300',
                        allowOutsideClick: true,
                        allowEscapeKey: true,
                        showConfirmButton: false
                    });
                });
            }).bind(this));
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
