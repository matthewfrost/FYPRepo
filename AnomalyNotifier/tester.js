var request = require('supertest');
var chai = require('chai'), expect = chai.expect, should = chai.should();
describe('testing anomaly notifier', function () {
    var url;
    url = 'http://localhost:8083/'
    beforeEach(function (done) {
        done();
    });
    afterEach(function () {
    });
    it('should return 4 anomalies', function testAnomalyService(done) {
        request(url)
            .get('getAnomalies?lat=54.569467&long=-1.2342727')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(4);
                done();
            });

    });
    it('should return 0 anomalies', function testNoAnomalies(done) {
        request(url)
            .get('getAnomalies?lat=53.569467&long=-1.2342727')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(0);
                done();
            });
    });
    it('should allow submission of a valid resolution', function testResolutionSubmission(done) {
        var resolution = {
            LocationID: 16,
            Resolution: 'unit test resolution',
            Value: 9999
        }
        request(url)
            .post('submitResolution')
            .send(resolution)
            .end(function (err, res) {
                res.statusCode.should.equal(200);
            });
        done();
    });
    it('should not allow the submission of an invalid resolution', function invalidResolution(done) {
        var resolution = {
            Resolution: 'no LocationID',
            Value: 1233
        }
        request(url)
            .post('submitResolution')
            .send(resolution)
            .end(function (err, res) {
                res.statusCode.should.equal(500);
            });
        done();
    });
});