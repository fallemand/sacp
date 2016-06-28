'use strict';
(function () {

    class ViewTreatmentController {
        constructor($http, $stateParams) {
            this.id = $stateParams.id;
            $http.get('/api/treatments/' + $stateParams.id)
                .then(response => {
                    this.treatment = response.data;
                })
                .catch(err => {
                    this.ngToast.create({
                        className: 'danger',
                        content: err.message
                    });
                });

            this.drugsTable = {
                entity: 'treatments',
                type: 'local',
                metadataFilters: 'field=drugs'
            };
        }

        createPdf() {
            html2canvas(document.getElementById('prescription'), {
                onrendered: (function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("prescription-" + this.id + ".pdf");
                }).bind({id: this.id})
            });
        }
    }

    angular.module('sacpApp')
        .component('viewtreatment', {
            templateUrl: 'app/treatments/view/view-treatment.html',
            controller: ViewTreatmentController,
            controllerAs: 'vm'
        });

})();
