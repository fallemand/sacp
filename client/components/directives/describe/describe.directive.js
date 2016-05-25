'use strict';

angular.module('sacpApp')
    .directive('describe', function ($http) {
        return {
            templateUrl: 'components/directives/describe/describe.html',
            restrict: 'A',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {
                $http.get('/api/' + attrs.entity + '/metadata')
                    .then(response => {
                        var fields = response.data.fields;
                        for (var field in fields) {
                            element.append('<dt>' + fields[field].title + '</dt>');
                            element.append('<dd>' + scope.data[fields[field].field] + '</dd>');
                        }
                    })
                    .catch(err => {
                        ngToast.create({
                            className: 'danger',
                            content: err.message
                        });
                    });
            }
        };
    });
