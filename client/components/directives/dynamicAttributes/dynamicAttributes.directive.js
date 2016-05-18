'use strict';

angular.module('sacpApp')
    .directive('dynamicAttributes', function () {
        return {
            scope: { dynamicAttributes: '=' },
            link: function (scope, element, attrs) {
                if (attrs.requiredConfig == "true") {
                    element.attr('required', 'true');
                }
            }
        };
    });
