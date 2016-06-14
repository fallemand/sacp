'use strict';
(function(){

class PrescriptionComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sacpApp')
  .component('prescription', {
    templateUrl: 'app/prescription/prescription.html',
    controller: PrescriptionComponent
  });

})();
