'use strict';

var app = require('../..');
import request from 'supertest';

var newTreatmentHistory;

describe('TreatmentHistory API:', function() {

  describe('GET /api/treatmen-history', function() {
    var treatmentHistorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatmen-history')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatmentHistorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      treatmentHistorys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/treatmen-history', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/treatmen-history')
        .send({
          name: 'New TreatmentHistory',
          info: 'This is the brand new treatmentHistory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTreatmentHistory = res.body;
          done();
        });
    });

    it('should respond with the newly created treatmentHistory', function() {
      newTreatmentHistory.name.should.equal('New TreatmentHistory');
      newTreatmentHistory.info.should.equal('This is the brand new treatmentHistory!!!');
    });

  });

  describe('GET /api/treatmen-history/:id', function() {
    var treatmentHistory;

    beforeEach(function(done) {
      request(app)
        .get('/api/treatmen-history/' + newTreatmentHistory._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          treatmentHistory = res.body;
          done();
        });
    });

    afterEach(function() {
      treatmentHistory = {};
    });

    it('should respond with the requested treatmentHistory', function() {
      treatmentHistory.name.should.equal('New TreatmentHistory');
      treatmentHistory.info.should.equal('This is the brand new treatmentHistory!!!');
    });

  });

  describe('PUT /api/treatmen-history/:id', function() {
    var updatedTreatmentHistory;

    beforeEach(function(done) {
      request(app)
        .put('/api/treatmen-history/' + newTreatmentHistory._id)
        .send({
          name: 'Updated TreatmentHistory',
          info: 'This is the updated treatmentHistory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTreatmentHistory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTreatmentHistory = {};
    });

    it('should respond with the updated treatmentHistory', function() {
      updatedTreatmentHistory.name.should.equal('Updated TreatmentHistory');
      updatedTreatmentHistory.info.should.equal('This is the updated treatmentHistory!!!');
    });

  });

  describe('DELETE /api/treatmen-history/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/treatmen-history/' + newTreatmentHistory._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when treatmentHistory does not exist', function(done) {
      request(app)
        .delete('/api/treatmen-history/' + newTreatmentHistory._id)
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
