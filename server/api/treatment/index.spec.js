'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var treatmentCtrlStub = {
  index: 'treatmentCtrl.index',
  show: 'treatmentCtrl.show',
  create: 'treatmentCtrl.create',
  update: 'treatmentCtrl.update',
  destroy: 'treatmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var treatmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './treatment.controller': treatmentCtrlStub
});

describe('Treatment API Router:', function() {

  it('should return an express router instance', function() {
    treatmentIndex.should.equal(routerStub);
  });

  describe('GET /api/treatments', function() {

    it('should route to treatment.controller.index', function() {
      routerStub.get
        .withArgs('/', 'treatmentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/treatments/:id', function() {

    it('should route to treatment.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'treatmentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/treatments', function() {

    it('should route to treatment.controller.create', function() {
      routerStub.post
        .withArgs('/', 'treatmentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/treatments/:id', function() {

    it('should route to treatment.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'treatmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/treatments/:id', function() {

    it('should route to treatment.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'treatmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/treatments/:id', function() {

    it('should route to treatment.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'treatmentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
