'use strict';

class SettingsController {
  constructor(Auth) {
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Contraseña actualizada con éxito.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Contraseña Incorrecta';
          this.message = '';
        });
    }
  }
}

angular.module('sacpApp')
  .controller('SettingsController', SettingsController);
