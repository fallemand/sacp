'use strict';

angular.module('sacpApp')
    .directive('dynamicAttributes', [ "$compile", function ($compile) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 1000,
            require: "^form",
            scope: { dynamicAttributes: '=' },
            link: function (scope, element, attrs, formController) {
                var templateElement;
                var previousTemplate;
                templateElement = element.clone();
                templateElement.removeAttr("dynamic-attributes");

                angular.forEach(scope.dynamicAttributes, (value, attribute) => {
                    templateElement.attr(attribute, value);
                });
                templateElement.insertBefore(element);

                var control = formController[element.attr("name")];
                if (control){
                    formController.$removeControl(control);
                }
                if (previousTemplate) {
                    previousTemplate.remove();
                }

                $compile(templateElement)(scope);
            }
        };
    }]);
