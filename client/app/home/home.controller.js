'use strict';
(function(){

class HomeComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('sacpApp')
  .component('home', {
    templateUrl: 'app/home/home.html',
    controller: HomeComponent
  });

})();
