'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var drugPresentationCtrlStub = {
  index: 'drugPresentationCtrl.index',
  show: 'drugPresentationCtrl.show',
  create: 'drugPresentationCtrl.create',
  upsert: 'drugPresentationCtrl.upsert',
  patch: 'drugPresentationCtrl.patch',
  destroy: 'drugPresentationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var drugPresentationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './drug-presentation.controller': drugPresentationCtrlStub
});

describe('DrugPresentation API Router:', function() {
  it('should return an express router instance', function() {
    drugPresentationIndex.should.equal(routerStub);
  });

  describe('GET /api/drug-presentations', function() {
    it('should route to drugPresentation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'drugPresentationCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/drug-presentations/:id', function() {
    it('should route to drugPresentation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'drugPresentationCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/drug-presentations', function() {
    it('should route to drugPresentation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'drugPresentationCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/drug-presentations/:id', function() {
    it('should route to drugPresentation.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'drugPresentationCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/drug-presentations/:id', function() {
    it('should route to drugPresentation.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'drugPresentationCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/drug-presentations/:id', function() {
    it('should route to drugPresentation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'drugPresentationCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
