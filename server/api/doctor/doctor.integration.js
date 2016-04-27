'use strict';

var app = require('../..');
import request from 'supertest';

var newDoctor;

describe('Doctor API:', function() {

  describe('GET /api/doctors', function() {
    var doctors;

    beforeEach(function(done) {
      request(app)
        .get('/api/doctors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          doctors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      doctors.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/doctors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/doctors')
        .send({
          name: 'New Doctor',
          info: 'This is the brand new doctor!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDoctor = res.body;
          done();
        });
    });

    it('should respond with the newly created doctor', function() {
      newDoctor.name.should.equal('New Doctor');
      newDoctor.info.should.equal('This is the brand new doctor!!!');
    });

  });

  describe('GET /api/doctors/:id', function() {
    var doctor;

    beforeEach(function(done) {
      request(app)
        .get('/api/doctors/' + newDoctor._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          doctor = res.body;
          done();
        });
    });

    afterEach(function() {
      doctor = {};
    });

    it('should respond with the requested doctor', function() {
      doctor.name.should.equal('New Doctor');
      doctor.info.should.equal('This is the brand new doctor!!!');
    });

  });

  describe('PUT /api/doctors/:id', function() {
    var updatedDoctor;

    beforeEach(function(done) {
      request(app)
        .put('/api/doctors/' + newDoctor._id)
        .send({
          name: 'Updated Doctor',
          info: 'This is the updated doctor!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDoctor = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDoctor = {};
    });

    it('should respond with the updated doctor', function() {
      updatedDoctor.name.should.equal('Updated Doctor');
      updatedDoctor.info.should.equal('This is the updated doctor!!!');
    });

  });

  describe('DELETE /api/doctors/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/doctors/' + newDoctor._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when doctor does not exist', function(done) {
      request(app)
        .delete('/api/doctors/' + newDoctor._id)
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
