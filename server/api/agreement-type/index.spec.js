'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var agreementTypeCtrlStub = {
  index: 'agreementTypeCtrl.index',
  show: 'agreementTypeCtrl.show',
  create: 'agreementTypeCtrl.create',
  update: 'agreementTypeCtrl.update',
  destroy: 'agreementTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var agreementTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './agreement-type.controller': agreementTypeCtrlStub
});

describe('AgreementType API Router:', function() {

  it('should return an express router instance', function() {
    agreementTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/agreement-types', function() {

    it('should route to agreementType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'agreementTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/agreement-types/:id', function() {

    it('should route to agreementType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'agreementTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/agreement-types', function() {

    it('should route to agreementType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'agreementTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/agreement-types/:id', function() {

    it('should route to agreementType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'agreementTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/agreement-types/:id', function() {

    it('should route to agreementType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'agreementTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/agreement-types/:id', function() {

    it('should route to agreementType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'agreementTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
