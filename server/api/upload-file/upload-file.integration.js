'use strict';

var app = require('../..');
import request from 'supertest';

var newUploadFile;

describe('UploadFile API:', function() {

  describe('GET /api/upload-files', function() {
    var uploadFiles;

    beforeEach(function(done) {
      request(app)
        .get('/api/upload-files')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          uploadFiles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      uploadFiles.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/upload-files', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/upload-files')
        .send({
          name: 'New UploadFile',
          info: 'This is the brand new uploadFile!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newUploadFile = res.body;
          done();
        });
    });

    it('should respond with the newly created uploadFile', function() {
      newUploadFile.name.should.equal('New UploadFile');
      newUploadFile.info.should.equal('This is the brand new uploadFile!!!');
    });

  });

  describe('GET /api/upload-files/:id', function() {
    var uploadFile;

    beforeEach(function(done) {
      request(app)
        .get('/api/upload-files/' + newUploadFile._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          uploadFile = res.body;
          done();
        });
    });

    afterEach(function() {
      uploadFile = {};
    });

    it('should respond with the requested uploadFile', function() {
      uploadFile.name.should.equal('New UploadFile');
      uploadFile.info.should.equal('This is the brand new uploadFile!!!');
    });

  });

  describe('PUT /api/upload-files/:id', function() {
    var updatedUploadFile;

    beforeEach(function(done) {
      request(app)
        .put('/api/upload-files/' + newUploadFile._id)
        .send({
          name: 'Updated UploadFile',
          info: 'This is the updated uploadFile!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedUploadFile = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUploadFile = {};
    });

    it('should respond with the updated uploadFile', function() {
      updatedUploadFile.name.should.equal('Updated UploadFile');
      updatedUploadFile.info.should.equal('This is the updated uploadFile!!!');
    });

  });

  describe('DELETE /api/upload-files/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/upload-files/' + newUploadFile._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when uploadFile does not exist', function(done) {
      request(app)
        .delete('/api/upload-files/' + newUploadFile._id)
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
