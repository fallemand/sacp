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
                    getValue: this.actionsCol,
                    class : 'table-actions col-md-1',
                    actions: this.datatable.actions,
                    customActions: this.datatable.customActions,
                    privileges: (this.datatable.privileges && this.datatable.privileges[this.userType] && this.datatable.privileges[this.userType].actions) ? this.datatable.privileges[this.userType].actions : undefined
                };
                cols.push(actionsCol);
            }
            angular.forEach(this.metadata.fields, (value) => {
                var filter = {};
                if(value.type === 'select' || value.type === 'typeahead') {
                    if(value.filterDescField) {
                        filter[value.field + '.' + value.filterDescField] = 'text';
                    }
                    else {
                        filter[value.field + '.' + value.descField] = 'text';
                    }
                }
                else {
                    filter[value.field] = 'text';
                }

                var col = {
                    field: value.field,
                    title: (value.shortTitle) ? value.shortTitle : value.title,
                    show: value.show,
                    sortable: value.field,
                    filter: filter,
                    decorate: this.decorate,
                    decorator: value.decorator,
                    link: value.link
                };
                if(value.columnClass) {
                    col.class = value.columnClass;
                }
                if(value.field.type === 'select' || value.field.type === 'typeahead') {
                    getData(value.field, value.remoteApi, col.filterData);
                }
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

        loadData(field, api, value) {
            this.$http.get('/api/' + api)
                .then(response => {
                    value = response.data;
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }

        initialize() {
            this.loadedData = true;
            switch (this.datatable.type) {
                case 'remote' :
                    this.datatable.ngtable = new this.NgTableParams({count: 25}, {
                        getData: (function ($defer, params) {
                            var filters = (this.datatable.filters) ? '?' + this.datatable.filters : '';
                            var entityId = (this.datatable.id) ? '/' + this.datatable.id : '';
                            var mine = (this.datatable.privileges && this.datatable.privileges[this.userType] && this.datatable.privileges[this.userType].list) ? '/mine' : '';

                            var parameters = {
                                page: params.page(),
                                count: params.count(),
                                sorting: params.sorting(),
                                filter: params.filter()
                            };
                            if(this.datatable.filter) {
                                this.datatable.filter = JSON.parse(this.datatable.filter);
                                for(var filter in this.datatable.filter) {
                                    parameters.filter[filter] = this.datatable.filter[filter];
                                }
                            }
                            this.$http({
                                url: '/api/' + this.datatable.entity + entityId + mine + filters,
                                method: "GET",
                                params: parameters
                            }).then(response => {
                                params.total(response.data.total);
                                if(this.datatable.field) {
                                    response.data = response.data[this.datatable.field];
                                }
                                $defer.resolve(response.data.docs);
                            });
                        }).bind(this),
                        counts: [25,50,100]
                    });
                    break;
                case 'local' :
                    this.datatable.ngtable = new this.NgTableParams({
                        page: 1, // show first page
                        count: 20 // count per page
                    }, {
                        getData: (function ($defer, params) {
                            this.datatable.ngtable.total(this.$scope.object.length),
                            $defer.resolve(this.$scope.object);
                        }).bind(this),
                        total: 0,
                        counts: []
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
            if(this.link) {
                return '<a href="' + this.link + '/' + row._id + '" >' + value + '</a>';
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
            return (value) ? new Date(value).toLocaleDateString() : '-';
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
            if(this.link) {
                return '<a href="' + this.link + '/' +  value._id + '">' + value.name + '</a>';
            }
            return value.name;
        }

        actionsCol($scope, row) {
            var html = '<div class="btn-group">';
            angular.forEach(this.actions, (value, key) => {
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
                            html += '<a class="btn btn-xs btn-success" ng-click="vm.activate(row)" uib-tooltip="Activar" tooltip-placement="top"><i class="fa fa-check-square"></i></a>';
                            break;
                        case 'cancel' :
                            html += '<a class="btn btn-xs btn-danger" ng-click="vm.delete(row)" uib-tooltip="Cancelar" tooltip-placement="top"><i class="fa fa-times"></i></a>';
                            break;
                    }
                }
            });
            if(this.customActions) {
                angular.forEach(this.customActions, (value, key) => {
                    if(!this.privileges || this.privileges.indexOf(key) > -1) {
                        html += value(row);
                    }
                });
            }
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

    angular.module('sacpApp')
        .controller('DatatableController', DatatableController);

})();
