var request = require('supertest');
var chai = require('chai'), expect = chai.expect, should = chai.should();
describe('testing location data web service', function () {
    var url;
    url = 'http://localhost:8082/'
    it('should get data for a given location', function (done) {
        request(url)
            .get('getData?id=16')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.length(911);
                done();
            });
    });
})
