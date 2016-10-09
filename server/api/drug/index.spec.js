'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var drugCtrlStub = {
  index: 'drugCtrl.index',
  show: 'drugCtrl.show',
  create: 'drugCtrl.create',
  upsert: 'drugCtrl.upsert',
  patch: 'drugCtrl.patch',
  destroy: 'drugCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var drugIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './drug.controller': drugCtrlStub
});

describe('Drug API Router:', function() {
  it('should return an express router instance', function() {
    drugIndex.should.equal(routerStub);
  });

  describe('GET /api/drugs', function() {
    it('should route to drug.controller.index', function() {
      routerStub.get
        .withArgs('/', 'drugCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/drugs/:id', function() {
    it('should route to drug.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'drugCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/drugs', function() {
    it('should route to drug.controller.create', function() {
      routerStub.post
        .withArgs('/', 'drugCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/drugs/:id', function() {
    it('should route to drug.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'drugCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/drugs/:id', function() {
    it('should route to drug.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'drugCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/drugs/:id', function() {
    it('should route to drug.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'drugCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
