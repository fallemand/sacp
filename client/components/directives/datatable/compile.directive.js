(function() {
    "use strict";

    angular.module('sacpApp').directive("demoBindCompiledHtml", bindCompiledHtml);
    bindCompiledHtml.$inject = [];

    function bindCompiledHtml(){
        var directive = {
            restrict: "A",
            controller: bindCompiledHtmlController
        };
        return directive;
    }

    bindCompiledHtmlController.$inject = ["$scope", "$element", "$attrs", "$compile"];
    function bindCompiledHtmlController($scope, $element, $attrs, $compile){
        $scope.$watch($attrs.demoBindCompiledHtml, compileHtml);

        function compileHtml(html){
            var compiledElements;
            if(typeof html == 'string' &&  html.indexOf('<') == 0) {
                compiledElements = $compile(html)($scope);
            }
            else {
                compiledElements = html;
            }
            $element.append(compiledElements);
        }
    }
})();
