/*jslint node: true, vars: true, indent: 4 */
'use strict';

var Omnibus = require('../src/Omnibus'),
    vows = require('vows'),
    assert = require('assert');

vows.describe('Omnibus Elevator').addBatch({
    'peut etre instancié':{
        topic: new Omnibus(5),
        ' le cycle est de 5x2x3 étapes': function (o) {
            //console.log(o.cycle);
            assert.equal(o.cycle.length, 5*2*3);
        }
    }
}).export(module);