'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var reportCtrlStub = {
  index: 'reportCtrl.index',
  show: 'reportCtrl.show',
  create: 'reportCtrl.create',
  upsert: 'reportCtrl.upsert',
  patch: 'reportCtrl.patch',
  destroy: 'reportCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var reportIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './report.controller': reportCtrlStub
});

describe('Report API Router:', function() {
  it('should return an express router instance', function() {
    reportIndex.should.equal(routerStub);
  });

  describe('GET /api/reports', function() {
    it('should route to report.controller.index', function() {
      routerStub.get
        .withArgs('/', 'reportCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/reports/:id', function() {
    it('should route to report.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'reportCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/reports', function() {
    it('should route to report.controller.create', function() {
      routerStub.post
        .withArgs('/', 'reportCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/reports/:id', function() {
    it('should route to report.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'reportCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/reports/:id', function() {
    it('should route to report.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'reportCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/reports/:id', function() {
    it('should route to report.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'reportCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
