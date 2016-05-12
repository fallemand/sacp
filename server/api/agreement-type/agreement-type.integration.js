'use strict';

var app = require('../..');
import request from 'supertest';

var newAgreementType;

describe('AgreementType API:', function() {

  describe('GET /api/agreement-types', function() {
    var agreementTypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/agreement-types')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agreementTypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      agreementTypes.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/agreement-types', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/agreement-types')
        .send({
          name: 'New AgreementType',
          info: 'This is the brand new agreementType!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAgreementType = res.body;
          done();
        });
    });

    it('should respond with the newly created agreementType', function() {
      newAgreementType.name.should.equal('New AgreementType');
      newAgreementType.info.should.equal('This is the brand new agreementType!!!');
    });

  });

  describe('GET /api/agreement-types/:id', function() {
    var agreementType;

    beforeEach(function(done) {
      request(app)
        .get('/api/agreement-types/' + newAgreementType._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          agreementType = res.body;
          done();
        });
    });

    afterEach(function() {
      agreementType = {};
    });

    it('should respond with the requested agreementType', function() {
      agreementType.name.should.equal('New AgreementType');
      agreementType.info.should.equal('This is the brand new agreementType!!!');
    });

  });

  describe('PUT /api/agreement-types/:id', function() {
    var updatedAgreementType;

    beforeEach(function(done) {
      request(app)
        .put('/api/agreement-types/' + newAgreementType._id)
        .send({
          name: 'Updated AgreementType',
          info: 'This is the updated agreementType!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAgreementType = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAgreementType = {};
    });

    it('should respond with the updated agreementType', function() {
      updatedAgreementType.name.should.equal('Updated AgreementType');
      updatedAgreementType.info.should.equal('This is the updated agreementType!!!');
    });

  });

  describe('DELETE /api/agreement-types/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/agreement-types/' + newAgreementType._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when agreementType does not exist', function(done) {
      request(app)
        .delete('/api/agreement-types/' + newAgreementType._id)
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
