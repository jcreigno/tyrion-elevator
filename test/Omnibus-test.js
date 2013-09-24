/*jslint node: true, vars: true, indent: 4 */
'use strict';

var Omnibus = require('../src/Omnibus'),
    vows = require('vows'),
    assert = require('assert');

var upward = Array.apply(null, new Array(5)).map(function () {
    return ['UP', 'OPEN', 'CLOSE'];
});
var downward = Array.apply(null, new Array(5)).map(function () {
    return ['DOWN', 'OPEN', 'CLOSE'];
});

function appendCommands(batch){
    var context = batch['peut etre instancié'];
    var cmd = [].concat.apply([], upward.concat(downward)); //flatten
    cmd = cmd.concat(cmd);
    cmd.forEach(function (e, i){
        var subtopic = context['on appelle la commande ' + (i + 1)] = {
            topic : function (o) {
                return o.nextCommand();
            }
        };
        subtopic['on obtient "' + e + '"'] = function (res) {
            assert.equal(res, e);
        };
    });
    return batch;
}

function createBatch() {
    var result = {
        'peut etre instancié': {
            topic: new Omnibus(5),
            ' le cycle est de 5x2x3 étapes': function (o) {
                //console.log(o.cycle);
                assert.equal(o.cycle.length, 5 * 2 * 3);
            }
        }
    };
    return  appendCommands(result);
}

vows.describe('Omnibus Elevator').addBatch(createBatch()).export(module);