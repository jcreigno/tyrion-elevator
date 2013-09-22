/*jslint node: true, vars: true, indent: 4 */
'use strict';

var vows = require('vows'),
    request = require('request'),
    assert = require('assert'),
    apiTest = require('./ApiTest')();

var server = require('../src/index');

var events = ['/call?atFloor=[0-5]&to=[UP|DOWN]',
              '/go?floorToGo=[0-5]',
              '/userHasEntered',
              '/userHasExited',
              '/reset?cause=information+message'];

function addEvents(batch) {
    events.forEach(function (e) {
        batch['doit répondre à l évènement "' + e + '"'] = {
            topic: function () {
                apiTest.get(e, this.callback);
            },
            'avec un status code 200': apiTest.assertStatus(200)
        };
    });
    return batch;
}

function createBatch() {
    var result = {
        'doit être démarré': {
            topic: function () {
                apiTest.get(this.callback);
            },
            'et répondre un code 200': apiTest.assertStatus(200),
            'et repond "NOTHING"': apiTest.assertBody('NOTHING')
        },
        'doit répondre à "nextCommand"' : {
            topic: function () {
                apiTest.get('/nextCommand', this.callback);
            },
            'et répondre un code 200': apiTest.assertStatus(200),
            'et repond une commande parmi "NOTHING, UP, DOWN, OPEN, CLOSE"': apiTest.assertBody(/NOTHING|UP|DOWN|OPEN|CLOSE/)
        }
    };
    return addEvents(result);
}

vows.describe('Le serveur "Tyrion Elevator"').addBatch(createBatch()).export(module);