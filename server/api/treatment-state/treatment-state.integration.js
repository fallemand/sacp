'use strict';

var app = require('../..');
import request from 'supertest';

var newTreatmentState;

describe('TreatmentState API:', function() {

  describe('GET /api/treatment-states', function() {
    var treatmentStates;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatment-states')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatmentStates = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      treatmentStates.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/treatment-states', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/treatment-states')
        .send({
          name: 'New TreatmentState',
          info: 'This is the brand new treatmentState!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTreatmentState = res.body;
          done();
        });
    });

    it('should respond with the newly created treatmentState', function() {
      newTreatmentState.name.should.equal('New TreatmentState');
      newTreatmentState.info.should.equal('This is the brand new treatmentState!!!');
    });

  });

  describe('GET /api/treatment-states/:id', function() {
    var treatmentState;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatment-states/' + newTreatmentState._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatmentState = res.body;
          done();
        });
    });

    afterEach(function() {
      treatmentState = {};
    });

    it('should respond with the requested treatmentState', function() {
      treatmentState.name.should.equal('New TreatmentState');
      treatmentState.info.should.equal('This is the brand new treatmentState!!!');
    });

  });

  describe('PUT /api/treatment-states/:id', function() {
    var updatedTreatmentState;

    beforeEach(function(done) {
      request(app)
        .put('/api/treatment-states/' + newTreatmentState._id)
        .send({
          name: 'Updated TreatmentState',
          info: 'This is the updated treatmentState!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTreatmentState = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTreatmentState = {};
    });

    it('should respond with the updated treatmentState', function() {
      updatedTreatmentState.name.should.equal('Updated TreatmentState');
      updatedTreatmentState.info.should.equal('This is the updated treatmentState!!!');
    });

  });

  describe('DELETE /api/treatment-states/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/treatment-states/' + newTreatmentState._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when treatmentState does not exist', function(done) {
      request(app)
        .delete('/api/treatment-states/' + newTreatmentState._id)
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
