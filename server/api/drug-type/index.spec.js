'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var drugTypeCtrlStub = {
  index: 'drugTypeCtrl.index',
  show: 'drugTypeCtrl.show',
  create: 'drugTypeCtrl.create',
  update: 'drugTypeCtrl.update',
  destroy: 'drugTypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var drugTypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './drug-type.controller': drugTypeCtrlStub
});

describe('DrugType API Router:', function() {

  it('should return an express router instance', function() {
    drugTypeIndex.should.equal(routerStub);
  });

  describe('GET /api/drug-types', function() {

    it('should route to drugType.controller.index', function() {
      routerStub.get
        .withArgs('/', 'drugTypeCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/drug-types/:id', function() {

    it('should route to drugType.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'drugTypeCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/drug-types', function() {

    it('should route to drugType.controller.create', function() {
      routerStub.post
        .withArgs('/', 'drugTypeCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/drug-types/:id', function() {

    it('should route to drugType.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'drugTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/drug-types/:id', function() {

    it('should route to drugType.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'drugTypeCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/drug-types/:id', function() {

    it('should route to drugType.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'drugTypeCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
