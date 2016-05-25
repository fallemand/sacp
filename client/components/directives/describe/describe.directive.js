'use strict';

angular.module('sacpApp')
    .directive('describe', function ($http) {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {
                $http.get('/api/' + attrs.entity + '/metadata')
                    .then(response => {
                        var fields = response.data.fields;
                        angular.forEach(fields, function(field, key){
                            element.append('<dt>' + field.title + '</dt>');
                            if(field.controlType == 'object') {
                                element.append('<dd>' + scope.data[field.field][field.descField] + '</dd>');
                            }
                            else {
                                element.append('<dd>' + scope.data[field.field] + '</dd>');
                            }
                        });
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
