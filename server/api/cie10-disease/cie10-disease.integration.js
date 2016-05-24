'use strict';

var app = require('../..');
import request from 'supertest';

var newCie10Disease;

describe('Cie10Disease API:', function() {

  describe('GET /api/cie10-diseases', function() {
    var cie10Diseases;

    beforeEach(function(done) {
      request(app)
        .get('/api/cie10-diseases')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cie10Diseases = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cie10Diseases.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/cie10-diseases', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cie10-diseases')
        .send({
          name: 'New Cie10Disease',
          info: 'This is the brand new cie10Disease!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCie10Disease = res.body;
          done();
        });
    });

    it('should respond with the newly created cie10Disease', function() {
      newCie10Disease.name.should.equal('New Cie10Disease');
      newCie10Disease.info.should.equal('This is the brand new cie10Disease!!!');
    });

  });

  describe('GET /api/cie10-diseases/:id', function() {
    var cie10Disease;

    beforeEach(function(done) {
      request(app)
        .get('/api/cie10-diseases/' + newCie10Disease._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cie10Disease = res.body;
          done();
        });
    });

    afterEach(function() {
      cie10Disease = {};
    });

    it('should respond with the requested cie10Disease', function() {
      cie10Disease.name.should.equal('New Cie10Disease');
      cie10Disease.info.should.equal('This is the brand new cie10Disease!!!');
    });

  });

  describe('PUT /api/cie10-diseases/:id', function() {
    var updatedCie10Disease;

    beforeEach(function(done) {
      request(app)
        .put('/api/cie10-diseases/' + newCie10Disease._id)
        .send({
          name: 'Updated Cie10Disease',
          info: 'This is the updated cie10Disease!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCie10Disease = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCie10Disease = {};
    });

    it('should respond with the updated cie10Disease', function() {
      updatedCie10Disease.name.should.equal('Updated Cie10Disease');
      updatedCie10Disease.info.should.equal('This is the updated cie10Disease!!!');
    });

  });

  describe('DELETE /api/cie10-diseases/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/cie10-diseases/' + newCie10Disease._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cie10Disease does not exist', function(done) {
      request(app)
        .delete('/api/cie10-diseases/' + newCie10Disease._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
