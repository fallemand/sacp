'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var uploadFileCtrlStub = {
  index: 'uploadFileCtrl.index',
  show: 'uploadFileCtrl.show',
  create: 'uploadFileCtrl.create',
  update: 'uploadFileCtrl.update',
  destroy: 'uploadFileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var uploadFileIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './upload-file.controller': uploadFileCtrlStub
});

describe('UploadFile API Router:', function() {

  it('should return an express router instance', function() {
    uploadFileIndex.should.equal(routerStub);
  });

  describe('GET /api/upload-files', function() {

    it('should route to uploadFile.controller.index', function() {
      routerStub.get
        .withArgs('/', 'uploadFileCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/upload-files/:id', function() {

    it('should route to uploadFile.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'uploadFileCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/upload-files', function() {

    it('should route to uploadFile.controller.create', function() {
      routerStub.post
        .withArgs('/', 'uploadFileCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/upload-files/:id', function() {

    it('should route to uploadFile.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'uploadFileCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/upload-files/:id', function() {

    it('should route to uploadFile.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'uploadFileCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/upload-files/:id', function() {

    it('should route to uploadFile.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'uploadFileCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
