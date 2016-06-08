'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var treatmentHistoryCtrlStub = {
  index: 'treatmentHistoryCtrl.index',
  show: 'treatmentHistoryCtrl.show',
  create: 'treatmentHistoryCtrl.create',
  update: 'treatmentHistoryCtrl.update',
  destroy: 'treatmentHistoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var treatmentHistoryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './treatment-history.controller': treatmentHistoryCtrlStub
});

describe('TreatmentHistory API Router:', function() {

  it('should return an express router instance', function() {
    treatmentHistoryIndex.should.equal(routerStub);
  });

  describe('GET /api/treatmen-history', function() {

    it('should route to treatmentHistory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'treatmentHistoryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/treatmen-history/:id', function() {

    it('should route to treatmentHistory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'treatmentHistoryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/treatmen-history', function() {

    it('should route to treatmentHistory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'treatmentHistoryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/treatmen-history/:id', function() {

    it('should route to treatmentHistory.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'treatmentHistoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/treatmen-history/:id', function() {

    it('should route to treatmentHistory.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'treatmentHistoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/treatmen-history/:id', function() {

    it('should route to treatmentHistory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'treatmentHistoryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
