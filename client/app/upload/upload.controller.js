'use strict';
(function () {

    class UploadComponent {
        constructor(Upload, $timeout) {
            this.message = 'Hello';
            this.Upload = Upload;
            this.$timeout = $timeout;
        }

        uploadFiles() {
            if (this.files && this.files.length) {
                for (var i = 0; i <this. files.length; i++) {
                    var file = this.files[i];
                    if (!file.$error) {
                        this.Upload.upload({
                            url: '/api/upload-files',
                            data: {
                                file: file
                            }
                        }).then((function (resp) {
                            this.$timeout((function() {
                                this.log = 'file: ' +
                                    resp.config.data.file.name +
                                    ', Response: ' + JSON.stringify(resp.data) +
                                    '\n' + this.log;
                            }).bind(this));
                        }).bind(this), null, (function (evt) {
                            var progressPercentage = parseInt(100.0 *
                                evt.loaded / evt.total);
                            this.log = 'progress: ' + progressPercentage +
                                '% ' + evt.config.data.file.name + '\n' +
                                this.log;
                        }).bind(this));
                    }
                }
            }
        };
    }

    angular.module('sacpApp')
        .component('upload', {
            templateUrl: 'app/upload/upload.html',
            controller: UploadComponent,
            controllerAs: 'vm'
        });

})();
