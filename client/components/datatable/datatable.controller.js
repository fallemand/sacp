'use strict';

(function () {

    class DatatableController {
        constructor($scope, $http, NgTableParams) {
            // Use the User $resource to fetch all users
            this.$scope = $scope;
            this.parameters = $scope.parameters;
            this.entity = parameters.entity;
            $http.get('/api/' + entity + '?active=false').then(response => {
                this.metedata = response.data;
            });


            alert($scope.parameters.entity);


            this.notActiveDoctorsTable = new NgTableParams({count: 2}, {
                getData: function ($defer, params) {
                    $http.get('/api/users?active=false').then(response => {
                        $defer.resolve(response.data);
                    });
                }
            });
        }
    }

    angular.module('sacpApp.admin')
        .controller('DatatableController', DatatableController);

})();
