/*jslint node: true, vars: true, indent: 4 */
'use strict';

var vows = require('vows'),
    request = require('request'),
    assert = require('assert'),
    apiTest = require('./ApiTest')();

var server = require('../src/index');

vows.describe('Le serveur "Tyrion Elevator"').addBatch({
    'doit être démarré': {
        topic: function () {
            apiTest.get(this.callback);
        },
        'et répondre un code 200': apiTest.assertStatus(200),
        'et repond "NOTHING"': apiTest.assertBody('NOTHING')
    }
}).export(module);