'use strict';
(function () {

    class HomeComponent {
        constructor($http, Auth) {
            if(Auth.isAdmin()) {
                $http.get('/api/users/count?active=false&&role=user').then(response => {
                    this.countNotActiveUsers = response.data;
                });

                $http.get('/api/treatments?state=EA').then(response => {
                    this.treatmentsEA = response.data.total;
                });

                $http.get('/api/treatments?state=PA').then(response => {
                    this.treatmentsPA = response.data.total;
                });
            }
        }
    }

    angular.module('sacpApp')
        .component('home', {
            templateUrl: 'app/home/home.html',
            controller: HomeComponent,
            controllerAs: 'vm'
        });

})();
