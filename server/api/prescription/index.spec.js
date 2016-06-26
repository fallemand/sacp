'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var prescriptionCtrlStub = {
  index: 'prescriptionCtrl.index',
  show: 'prescriptionCtrl.show',
  create: 'prescriptionCtrl.create',
  update: 'prescriptionCtrl.update',
  destroy: 'prescriptionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var prescriptionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './prescription.controller': prescriptionCtrlStub
});

describe('Prescription API Router:', function() {

  it('should return an express router instance', function() {
    prescriptionIndex.should.equal(routerStub);
  });

  describe('GET /api/prescriptions', function() {

    it('should route to prescription.controller.index', function() {
      routerStub.get
        .withArgs('/', 'prescriptionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/prescriptions/:id', function() {

    it('should route to prescription.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'prescriptionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/prescriptions', function() {

    it('should route to prescription.controller.create', function() {
      routerStub.post
        .withArgs('/', 'prescriptionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/prescriptions/:id', function() {

    it('should route to prescription.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'prescriptionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/prescriptions/:id', function() {

    it('should route to prescription.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'prescriptionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/prescriptions/:id', function() {

    it('should route to prescription.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'prescriptionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
