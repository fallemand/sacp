'use strict';

var app = require('../..');
import request from 'supertest';

var newDrug;

describe('Drug API:', function() {
  describe('GET /api/drugs', function() {
    var drugs;

    beforeEach(function(done) {
      request(app)
        .get('/api/drugs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          drugs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      drugs.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/drugs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/drugs')
        .send({
          name: 'New Drug',
          info: 'This is the brand new drug!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDrug = res.body;
          done();
        });
    });

    it('should respond with the newly created drug', function() {
      newDrug.name.should.equal('New Drug');
      newDrug.info.should.equal('This is the brand new drug!!!');
    });
  });

  describe('GET /api/drugs/:id', function() {
    var drug;

    beforeEach(function(done) {
      request(app)
        .get(`/api/drugs/${newDrug._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          drug = res.body;
          done();
        });
    });

    afterEach(function() {
      drug = {};
    });

    it('should respond with the requested drug', function() {
      drug.name.should.equal('New Drug');
      drug.info.should.equal('This is the brand new drug!!!');
    });
  });

  describe('PUT /api/drugs/:id', function() {
    var updatedDrug;

    beforeEach(function(done) {
      request(app)
        .put(`/api/drugs/${newDrug._id}`)
        .send({
          name: 'Updated Drug',
          info: 'This is the updated drug!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDrug = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDrug = {};
    });

    it('should respond with the original drug', function() {
      updatedDrug.name.should.equal('New Drug');
      updatedDrug.info.should.equal('This is the brand new drug!!!');
    });

    it('should respond with the updated drug on a subsequent GET', function(done) {
      request(app)
        .get(`/api/drugs/${newDrug._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let drug = res.body;

          drug.name.should.equal('Updated Drug');
          drug.info.should.equal('This is the updated drug!!!');

          done();
        });
    });
  });

  describe('PATCH /api/drugs/:id', function() {
    var patchedDrug;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/drugs/${newDrug._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Drug' },
          { op: 'replace', path: '/info', value: 'This is the patched drug!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDrug = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDrug = {};
    });

    it('should respond with the patched drug', function() {
      patchedDrug.name.should.equal('Patched Drug');
      patchedDrug.info.should.equal('This is the patched drug!!!');
    });
  });

  describe('DELETE /api/drugs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/drugs/${newDrug._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when drug does not exist', function(done) {
      request(app)
        .delete(`/api/drugs/${newDrug._id}`)
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
