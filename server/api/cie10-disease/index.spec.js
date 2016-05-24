'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cie10DiseaseCtrlStub = {
  index: 'cie10DiseaseCtrl.index',
  show: 'cie10DiseaseCtrl.show',
  create: 'cie10DiseaseCtrl.create',
  update: 'cie10DiseaseCtrl.update',
  destroy: 'cie10DiseaseCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cie10DiseaseIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './cie10-disease.controller': cie10DiseaseCtrlStub
});

describe('Cie10Disease API Router:', function() {

  it('should return an express router instance', function() {
    cie10DiseaseIndex.should.equal(routerStub);
  });

  describe('GET /api/cie10-diseases', function() {

    it('should route to cie10Disease.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cie10DiseaseCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/cie10-diseases/:id', function() {

    it('should route to cie10Disease.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cie10DiseaseCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/cie10-diseases', function() {

    it('should route to cie10Disease.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cie10DiseaseCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/cie10-diseases/:id', function() {

    it('should route to cie10Disease.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'cie10DiseaseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/cie10-diseases/:id', function() {

    it('should route to cie10Disease.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'cie10DiseaseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/cie10-diseases/:id', function() {

    it('should route to cie10Disease.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cie10DiseaseCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
