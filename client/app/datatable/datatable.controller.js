'use strict';
(function () {

    class DatatableComponent {
        constructor($http) {
            this.object= {};
            this.selected = undefined;
            this.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            this.$http = $http;
            this.parameters = {
                entity: 'users',
                filters: 'active=true',
                actions: ['activate', 'delete'],
                reloadEvent : function() {
                    alert(true);
                }
            };
            this.autoform = {
                'entity' : 'patients',
                'formGroupClass' : 'col-md-3',
                'template' : 'lite'
            };
        }

        submit() {
            alert(this.object.name)
        }

        getLocation(viewvalue) {
            return this.$http.get('/api/cie10-diseases?name=' + viewvalue)
                .then(response => {
                    return response.data;
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });
        }
    }

    angular.module('sacpApp')
        .component('datatablepage', {
            templateUrl: 'app/datatable/datatable.html',
            controller: DatatableComponent,
            controllerAs: 'vm'
        });

})();
