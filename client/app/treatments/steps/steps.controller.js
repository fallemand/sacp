'use strict';

class StepsController {
    constructor(multiStepFormInstance) {
        this.wizard = multiStepFormInstance;
        alert(true);
    }

    next(activeIndex) {
        this.autoformPatient.submitted = true;
        this.autoformPatient.form.$setSubmitted();
        if(this.autoformPatient.form.$valid) {
            this.wizard.getSteps();
        }
    }


}

angular.module('sacpApp')
    .controller('StepsController', StepsController);

