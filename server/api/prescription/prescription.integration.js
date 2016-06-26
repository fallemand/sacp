'use strict';

var app = require('../..');
import request from 'supertest';

var newPrescription;

describe('Prescription API:', function() {

  describe('GET /api/prescriptions', function() {
    var prescriptions;

    beforeEach(function(done) {
      request(app)
        .get('/api/prescriptions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          prescriptions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      prescriptions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/prescriptions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/prescriptions')
        .send({
          name: 'New Prescription',
          info: 'This is the brand new prescription!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPrescription = res.body;
          done();
        });
    });

    it('should respond with the newly created prescription', function() {
      newPrescription.name.should.equal('New Prescription');
      newPrescription.info.should.equal('This is the brand new prescription!!!');
    });

  });

  describe('GET /api/prescriptions/:id', function() {
    var prescription;

    beforeEach(function(done) {
      request(app)
        .get('/api/prescriptions/' + newPrescription._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          prescription = res.body;
          done();
        });
    });

    afterEach(function() {
      prescription = {};
    });

    it('should respond with the requested prescription', function() {
      prescription.name.should.equal('New Prescription');
      prescription.info.should.equal('This is the brand new prescription!!!');
    });

  });

  describe('PUT /api/prescriptions/:id', function() {
    var updatedPrescription;

    beforeEach(function(done) {
      request(app)
        .put('/api/prescriptions/' + newPrescription._id)
        .send({
          name: 'Updated Prescription',
          info: 'This is the updated prescription!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPrescription = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPrescription = {};
    });

    it('should respond with the updated prescription', function() {
      updatedPrescription.name.should.equal('Updated Prescription');
      updatedPrescription.info.should.equal('This is the updated prescription!!!');
    });

  });

  describe('DELETE /api/prescriptions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/prescriptions/' + newPrescription._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when prescription does not exist', function(done) {
      request(app)
        .delete('/api/prescriptions/' + newPrescription._id)
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
