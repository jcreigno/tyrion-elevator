/*jslint node: true, vars: true, indent: 4 */
'use strict';

var request = require('request'),
    assert = require('assert');

module.exports = function (url) {
    var apiUrl = 'http://' + (process.env.IP || 'localhost') + ':' + (process.env.PORT || 8080) || url;
    
    var general = function () {
        var args = Array.prototype.slice.apply(arguments);
        var cb = args.pop();
        var method = args.shift();
        var url = args.shift();
        var data = args.shift();

        request({
            method: method,
            url: apiUrl + (url || ''),
            body: data || ''
        }, cb);
    };
    
    return {
        get: function (url, data, cb) {
            var args = Array.prototype.slice.apply(arguments);
            args.unshift('GET');
            general.apply(null, args);
        },
        post: function (url, data, cb) {
            var args = Array.prototype.slice.apply(arguments);
            args.unshift('POST');
            general.apply(null, args);
        },
        assertStatus : function (code) {
            return function (err, res, body) {
                assert.equal(res.statusCode, code);
            };
        },
        assertBody : function (str) {
            return function (err, res, body) {
                assert.equal(body, str);
            };
        }
    };
};