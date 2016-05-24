'use strict';

angular.module('sacpApp')
    .directive('dynamicAttributes', [ "$compile", function ($compile) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 1000,
            require: "^form",
            link: function (scope, element, attrs, formController) {
                var newElement = element.clone();
                newElement
                    .addClass('form-control')
                    .attr('name', scope.field.field)
                    .removeAttr('dynamic-attributes');
                switch (scope.field.controlType) {
                    case 'input' :
                        newElement.attr('placeholder', scope.field.title);
                        newElement.attr('type', scope.field.type);
                        break;
                    case 'object' :
                        if(scope.field.type == 'select') {
                            newElement
                                .attr('ng-init', 'vm.loadData(field.field, field.remoteApi)')
                                .attr('ng-options', 'item[field.descField] for item in vm[field.field] track by item._id');
                            break;
                        }
                        if(scope.field.type == 'typeahead') {
                            newElement
                                .attr('uib-typeahead', 'item as item[field.descField] for item in vm.loadTypeAhead(field.remoteApi, $viewValue)');
                            break;
                        }
                }

                angular.forEach(scope.field.attributes, (value, attribute) => {
                    newElement.attr(attribute, value);
                });

                newElement.removeAttr("dynamic-attributes");
                newElement.insertBefore(element);
                element.remove();

                $compile(newElement)(scope);
            }
        };
    }]);
