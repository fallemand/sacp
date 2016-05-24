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
                        else {
                            if(scope.field.type == 'typeahead') {
                                newElement
                                    .attr('uib-typeahead', 'item as item[field.descField] for item in vm.loadTypeAhead(field.remoteApi, $viewValue)')
                                    .attr('typeahead-loading', 'vm.typeahead.loading')
                                    .attr('typeahead-no-results', 'vm.typeahead.noresults')
                                    .attr('typeahead-min-length', 2);
                                var noResults = angular.element('<div />')
                                    .attr('ng-show','vm.typeahead.noresults')
                                    .html('<i class="glyphicon glyphicon-remove"></i> Sin resultados');
                                var loading = angular.element('<i />')
                                    .attr('ng-show','vm.typeahead.loading')
                                    .addClass('glyphicon glyphicon-refresh');
                                break;
                            }
                        }

                }

                angular.forEach(scope.field.attributes, (value, attribute) => {
                    newElement.attr(attribute, value);
                });

                newElement.removeAttr("dynamic-attributes");
                newElement.insertBefore(element);
                if(noResults) {
                    noResults.insertAfter(newElement);
                }
                if(loading) {
                    loading.insertAfter(newElement);
                }
                element.remove();

                $compile(newElement)(scope);
            }
        };
    }]);
