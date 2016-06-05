'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var treatmentStateCtrlStub = {
  index: 'treatmentStateCtrl.index',
  show: 'treatmentStateCtrl.show',
  create: 'treatmentStateCtrl.create',
  update: 'treatmentStateCtrl.update',
  destroy: 'treatmentStateCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var treatmentStateIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './treatment-state.controller': treatmentStateCtrlStub
});

describe('TreatmentState API Router:', function() {

  it('should return an express router instance', function() {
    treatmentStateIndex.should.equal(routerStub);
  });

  describe('GET /api/treatment-states', function() {

    it('should route to treatmentState.controller.index', function() {
      routerStub.get
        .withArgs('/', 'treatmentStateCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/treatment-states/:id', function() {

    it('should route to treatmentState.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'treatmentStateCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/treatment-states', function() {

    it('should route to treatmentState.controller.create', function() {
      routerStub.post
        .withArgs('/', 'treatmentStateCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/treatment-states/:id', function() {

    it('should route to treatmentState.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'treatmentStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/treatment-states/:id', function() {

    it('should route to treatmentState.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'treatmentStateCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/treatment-states/:id', function() {

    it('should route to treatmentState.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'treatmentStateCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
