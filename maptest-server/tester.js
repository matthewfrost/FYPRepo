var request = require('supertest');
var chai = require('chai'), expect = chai.expect, should = chai.should();
describe('testing location web service', function () {
    var url;
    url = 'http://localhost:8081/'
    beforeEach(function (done) {
        done();
    });
    it('should get all locations', function getAll(done) {
        request(url)
            .get('getAll')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(14);
                done();
            });
    });
    it('should get all locations near a given location', function byLocation(done) {
        request(url)
            .get('getByLocation?lat=54.569467&long=-1.2342727')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(4);
                done();
            });
    });
    it('should get the schema for a given table', function getSchema(done) {
        request(url)
            .get('getSchema?database=FYPractice&table=Location')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(9);
                done();
            });
    });
    it('should allow the submission of a valid location', function createLocation(done) {
        var location = {
            LocationName: 'testLocation',
            ColumnValue: 'testLocation',
            Database: 'FYPractice',
            Table: 'Energy',
            Column: 'Item',
            Latitude: '54.5656977',
            Longitude: '-1.2372124'
        }
        request(url)
            .post('submit')
            .send(location)
            .end(function (err, res) {
                res.body.should.not.equal(500);
                done();
            });
    });
    it('should not allow the creation of an invalid location', function invalidLocation(done) {
        var location = {
            LocationName: 'testLocation',
            ColumnValue: 'testLocation',
            Table: 'Energy',
            Column: 'Item',
            Latitude: '54.5656977'
        }
        request(url)
            .post('submit')
            .send(location)
            .end(function (err, res) {
                res.body.should.equal(500);
                done();
            });
    })
    it('should allow the deleting of locations', function deleteLocation(done) {
        var id = {
            data: 29
        }
        request(url)
            .put('delete')
            .send(id)
            .end(function (err, res) {
                res.statusCode.should.equal(200);
            });
        done();
    }); 
});
