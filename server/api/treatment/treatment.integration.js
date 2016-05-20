'use strict';

var app = require('../..');
import request from 'supertest';

var newTreatment;

describe('Treatment API:', function() {

  describe('GET /api/treatments', function() {
    var treatments;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatments = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      treatments.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/treatments', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/treatments')
        .send({
          name: 'New Treatment',
          info: 'This is the brand new treatment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTreatment = res.body;
          done();
        });
    });

    it('should respond with the newly created treatment', function() {
      newTreatment.name.should.equal('New Treatment');
      newTreatment.info.should.equal('This is the brand new treatment!!!');
    });

  });

  describe('GET /api/treatments/:id', function() {
    var treatment;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatments/' + newTreatment._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatment = res.body;
          done();
        });
    });

    afterEach(function() {
      treatment = {};
    });

    it('should respond with the requested treatment', function() {
      treatment.name.should.equal('New Treatment');
      treatment.info.should.equal('This is the brand new treatment!!!');
    });

  });

  describe('PUT /api/treatments/:id', function() {
    var updatedTreatment;

    beforeEach(function(done) {
      request(app)
        .put('/api/treatments/' + newTreatment._id)
        .send({
          name: 'Updated Treatment',
          info: 'This is the updated treatment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTreatment = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTreatment = {};
    });

    it('should respond with the updated treatment', function() {
      updatedTreatment.name.should.equal('Updated Treatment');
      updatedTreatment.info.should.equal('This is the updated treatment!!!');
    });

  });

  describe('DELETE /api/treatments/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/treatments/' + newTreatment._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when treatment does not exist', function(done) {
      request(app)
        .delete('/api/treatments/' + newTreatment._id)
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
