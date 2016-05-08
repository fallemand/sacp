'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams) {
            // Use the User $resource to fetch all users
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.$http = $http;
            $http.get('/api/'+ this.parameters.entity +'/metadata').then(response => {
                this.metadata = response.data;
            });
            this.notActiveDoctorsTable = new NgTableParams({count: 2}, {
                getData: (function ($defer, params) {
                    $http.get('/api/'+ this.parameters.entity +'?' + this.parameters.filters).then(response => {
                        $defer.resolve(response.data);
                    });
                }).bind(this)
            });
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
