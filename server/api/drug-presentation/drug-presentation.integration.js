'use strict';

var app = require('../..');
import request from 'supertest';

var newDrugPresentation;

describe('DrugPresentation API:', function() {
  describe('GET /api/drug-presentations', function() {
    var drugPresentations;

    beforeEach(function(done) {
      request(app)
        .get('/api/drug-presentations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          drugPresentations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      drugPresentations.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/drug-presentations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/drug-presentations')
        .send({
          name: 'New DrugPresentation',
          info: 'This is the brand new drugPresentation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDrugPresentation = res.body;
          done();
        });
    });

    it('should respond with the newly created drugPresentation', function() {
      newDrugPresentation.name.should.equal('New DrugPresentation');
      newDrugPresentation.info.should.equal('This is the brand new drugPresentation!!!');
    });
  });

  describe('GET /api/drug-presentations/:id', function() {
    var drugPresentation;

    beforeEach(function(done) {
      request(app)
        .get(`/api/drug-presentations/${newDrugPresentation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          drugPresentation = res.body;
          done();
        });
    });

    afterEach(function() {
      drugPresentation = {};
    });

    it('should respond with the requested drugPresentation', function() {
      drugPresentation.name.should.equal('New DrugPresentation');
      drugPresentation.info.should.equal('This is the brand new drugPresentation!!!');
    });
  });

  describe('PUT /api/drug-presentations/:id', function() {
    var updatedDrugPresentation;

    beforeEach(function(done) {
      request(app)
        .put(`/api/drug-presentations/${newDrugPresentation._id}`)
        .send({
          name: 'Updated DrugPresentation',
          info: 'This is the updated drugPresentation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDrugPresentation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDrugPresentation = {};
    });

    it('should respond with the original drugPresentation', function() {
      updatedDrugPresentation.name.should.equal('New DrugPresentation');
      updatedDrugPresentation.info.should.equal('This is the brand new drugPresentation!!!');
    });

    it('should respond with the updated drugPresentation on a subsequent GET', function(done) {
      request(app)
        .get(`/api/drug-presentations/${newDrugPresentation._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let drugPresentation = res.body;

          drugPresentation.name.should.equal('Updated DrugPresentation');
          drugPresentation.info.should.equal('This is the updated drugPresentation!!!');

          done();
        });
    });
  });

  describe('PATCH /api/drug-presentations/:id', function() {
    var patchedDrugPresentation;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/drug-presentations/${newDrugPresentation._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched DrugPresentation' },
          { op: 'replace', path: '/info', value: 'This is the patched drugPresentation!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDrugPresentation = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDrugPresentation = {};
    });

    it('should respond with the patched drugPresentation', function() {
      patchedDrugPresentation.name.should.equal('Patched DrugPresentation');
      patchedDrugPresentation.info.should.equal('This is the patched drugPresentation!!!');
    });
  });

  describe('DELETE /api/drug-presentations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/drug-presentations/${newDrugPresentation._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when drugPresentation does not exist', function(done) {
      request(app)
        .delete(`/api/drug-presentations/${newDrugPresentation._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
