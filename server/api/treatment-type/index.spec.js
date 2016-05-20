'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var treatmentTypeCtrlStub = {
  index: 'treatmentTypeCtrl.index',
  show: 'treatmentTypeCtrl.show',
  create: 'treatmentTypeCtrl.create',
  update: 'treatmentTypeCtrl.update',
  destroy: 'treatmentTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var treatmentTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './treatment-type.controller': treatmentTypeCtrlStub
});

describe('TreatmentType API Router:', function() {

  it('should return an express router instance', function() {
    treatmentTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/treatment-types', function() {

    it('should route to treatmentType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'treatmentTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/treatment-types/:id', function() {

    it('should route to treatmentType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'treatmentTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/treatment-types', function() {

    it('should route to treatmentType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'treatmentTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/treatment-types/:id', function() {

    it('should route to treatmentType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'treatmentTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/treatment-types/:id', function() {

    it('should route to treatmentType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'treatmentTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/treatment-types/:id', function() {

    it('should route to treatmentType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'treatmentTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
