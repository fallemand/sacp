'use strict';

angular.module('sacpApp')
    .directive('autoinput', [ "$compile", function ($compile) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 599,
            require: "^form",
            link: function (scope, element, attrs, formController) {

                var newElement = element.clone()
                    .addClass('form-control')
                    .attr('name', scope.field.field)
                    .attr('ng-disabled', scope.field.disabled + ' || vm.autoform.disabled')
                    .removeAttr('autoinput');

                switch (scope.field.controlType) {
                    case 'input' :
                        newElement.attr('placeholder', (scope.field.placeholder) ? (scope.field.placeholder) : scope.field.title);
                        newElement.attr('type', scope.field.type);
                        if(scope.field.disabled) {
                            newElement.attr('disabled', 'disabled');
                        }
                        if(scope.field.type == 'date') {
                            if(scope.object && scope.object[scope.field.field]) {
                                scope.object[scope.field.field] = new Date(scope.object[scope.field.field]);
                            }
                        }
                        break;
                    case 'textarea' :
                        newElement.attr('placeholder', (scope.field.placeholder) ? (scope.field.placeholder) : scope.field.title);
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
