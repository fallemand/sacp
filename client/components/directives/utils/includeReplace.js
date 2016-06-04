/**
 * Created by falle on 04/06/2016.
 */
angular.module('sacpApp')
    .directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});
