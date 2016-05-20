'use strict';

var app = require('../..');
import request from 'supertest';

var newDrugType;

describe('DrugType API:', function() {

  describe('GET /api/drug-types', function() {
    var drugTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/drug-types')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          drugTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      drugTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/drug-types', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/drug-types')
        .send({
          name: 'New DrugType',
          info: 'This is the brand new drugType!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDrugType = res.body;
          done();
        });
    });

    it('should respond with the newly created drugType', function() {
      newDrugType.name.should.equal('New DrugType');
      newDrugType.info.should.equal('This is the brand new drugType!!!');
    });

  });

  describe('GET /api/drug-types/:id', function() {
    var drugType;

    beforeEach(function(done) {
      request(app)
        .get('/api/drug-types/' + newDrugType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          drugType = res.body;
          done();
        });
    });

    afterEach(function() {
      drugType = {};
    });

    it('should respond with the requested drugType', function() {
      drugType.name.should.equal('New DrugType');
      drugType.info.should.equal('This is the brand new drugType!!!');
    });

  });

  describe('PUT /api/drug-types/:id', function() {
    var updatedDrugType;

    beforeEach(function(done) {
      request(app)
        .put('/api/drug-types/' + newDrugType._id)
        .send({
          name: 'Updated DrugType',
          info: 'This is the updated drugType!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDrugType = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDrugType = {};
    });

    it('should respond with the updated drugType', function() {
      updatedDrugType.name.should.equal('Updated DrugType');
      updatedDrugType.info.should.equal('This is the updated drugType!!!');
    });

  });

  describe('DELETE /api/drug-types/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/drug-types/' + newDrugType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when drugType does not exist', function(done) {
      request(app)
        .delete('/api/drug-types/' + newDrugType._id)
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
