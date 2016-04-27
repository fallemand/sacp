'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var doctorCtrlStub = {
  index: 'doctorCtrl.index',
  show: 'doctorCtrl.show',
  create: 'doctorCtrl.create',
  update: 'doctorCtrl.update',
  destroy: 'doctorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var doctorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './doctor.controller': doctorCtrlStub
});

describe('Doctor API Router:', function() {

  it('should return an express router instance', function() {
    doctorIndex.should.equal(routerStub);
  });

  describe('GET /api/doctors', function() {

    it('should route to doctor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'doctorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/doctors/:id', function() {

    it('should route to doctor.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'doctorCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/doctors', function() {

    it('should route to doctor.controller.create', function() {
      routerStub.post
        .withArgs('/', 'doctorCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/doctors/:id', function() {

    it('should route to doctor.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'doctorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/doctors/:id', function() {

    it('should route to doctor.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'doctorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/doctors/:id', function() {

    it('should route to doctor.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'doctorCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
