'use strict';

angular.module('sacpApp')
    .directive('autoinput', [ "$compile", function ($compile) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 599,
            require: "^form",
            link: function (scope, element, attrs, formController) {
                var newElement = element.clone();
                newElement
                    .addClass('form-control')
                    .attr('name', scope.field.field)
                    .removeAttr('autoinput');
                switch (scope.field.controlType) {
                    case 'input' :
                        newElement.attr('placeholder', scope.field.title);
                        newElement.attr('type', scope.field.type);
                        break;
                    case 'textarea' :
                        newElement.attr('placeholder', scope.field.title);
                        break;
                    case 'object' :
                        if(scope.field.type == 'select') {
                            newElement
                                .attr('ng-init', 'vm.loadData(field.field, field.remoteApi)')
                                .attr('ng-options', 'item[field.descField] for item in vm[field.field] track by item._id');
                            break;
                        }
                        else {
                            if(scope.field.type == 'typeahead') {
                                newElement
                                    .attr('uib-typeahead', 'item as item[field.descField] for item in vm.loadTypeAhead(field.remoteApi, $viewValue, field.searchField)')
                                    .attr('typeahead-loading', 'vm.typeahead.loading')
                                    .attr('typeahead-no-results', 'vm.typeahead.noresults')
                                    .attr('typeahead-min-length', 2)
                                    .attr('typeahead-editable', 'false');
                                break;
                            }
                        }

                }

                angular.forEach(scope.field.attributes, (value, attribute) => {
                    newElement.attr(attribute, value);
                });

                newElement.removeAttr("autoinput");
                newElement.insertBefore(element);
                element.remove();

                $compile(newElement)(scope);
            }
        };
    }]);