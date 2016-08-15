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
                        for(var field in fields) {
                            if(fields[field].hideInList) {
                                continue;
                            }
                            var title = (fields[field].shortTitle) ? fields[field].shortTitle : fields[field].title;
                            element.append('<dt>' + title + '</dt>');
                            var desc = scope.data[fields[field].field];
                            if(desc) {
                                if(fields[field].controlType == 'object') {
                                    element.append('<dd>' + desc[fields[field].descField] + '</dd>');
                                }
                                else {
                                    element.append('<dd>' + desc + '</dd>');
                                }
                            }
                            else {
                                element.append('<dd>-</dd>');
                            }
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
