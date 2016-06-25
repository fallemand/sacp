'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var diseaseStageCtrlStub = {
  index: 'diseaseStageCtrl.index',
  show: 'diseaseStageCtrl.show',
  create: 'diseaseStageCtrl.create',
  update: 'diseaseStageCtrl.update',
  destroy: 'diseaseStageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var diseaseStageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './disease-stage.controller': diseaseStageCtrlStub
});

describe('DiseaseStage API Router:', function() {

  it('should return an express router instance', function() {
    diseaseStageIndex.should.equal(routerStub);
  });

  describe('GET /api/disease-stages', function() {

    it('should route to diseaseStage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'diseaseStageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/disease-stages/:id', function() {

    it('should route to diseaseStage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'diseaseStageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/disease-stages', function() {

    it('should route to diseaseStage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'diseaseStageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/disease-stages/:id', function() {

    it('should route to diseaseStage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'diseaseStageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/disease-stages/:id', function() {

    it('should route to diseaseStage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'diseaseStageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/disease-stages/:id', function() {

    it('should route to diseaseStage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'diseaseStageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
