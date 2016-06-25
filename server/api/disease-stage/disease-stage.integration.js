'use strict';

var app = require('../..');
import request from 'supertest';

var newDiseaseStage;

describe('DiseaseStage API:', function() {

  describe('GET /api/disease-stages', function() {
    var diseaseStages;

    beforeEach(function(done) {
      request(app)
        .get('/api/disease-stages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          diseaseStages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      diseaseStages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/disease-stages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/disease-stages')
        .send({
          name: 'New DiseaseStage',
          info: 'This is the brand new diseaseStage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDiseaseStage = res.body;
          done();
        });
    });

    it('should respond with the newly created diseaseStage', function() {
      newDiseaseStage.name.should.equal('New DiseaseStage');
      newDiseaseStage.info.should.equal('This is the brand new diseaseStage!!!');
    });

  });

  describe('GET /api/disease-stages/:id', function() {
    var diseaseStage;

    beforeEach(function(done) {
      request(app)
        .get('/api/disease-stages/' + newDiseaseStage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          diseaseStage = res.body;
          done();
        });
    });

    afterEach(function() {
      diseaseStage = {};
    });

    it('should respond with the requested diseaseStage', function() {
      diseaseStage.name.should.equal('New DiseaseStage');
      diseaseStage.info.should.equal('This is the brand new diseaseStage!!!');
    });

  });

  describe('PUT /api/disease-stages/:id', function() {
    var updatedDiseaseStage;

    beforeEach(function(done) {
      request(app)
        .put('/api/disease-stages/' + newDiseaseStage._id)
        .send({
          name: 'Updated DiseaseStage',
          info: 'This is the updated diseaseStage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDiseaseStage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDiseaseStage = {};
    });

    it('should respond with the updated diseaseStage', function() {
      updatedDiseaseStage.name.should.equal('Updated DiseaseStage');
      updatedDiseaseStage.info.should.equal('This is the updated diseaseStage!!!');
    });

  });

  describe('DELETE /api/disease-stages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/disease-stages/' + newDiseaseStage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when diseaseStage does not exist', function(done) {
      request(app)
        .delete('/api/disease-stages/' + newDiseaseStage._id)
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
