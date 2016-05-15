'use strict';

class StepsController {
    constructor(multiStepFormInstance) {
        this.wizard = multiStepFormInstance;
        alert(true);
    }

    
}

angular.module('sacpApp')
    .controller('StepsController', StepsController);

