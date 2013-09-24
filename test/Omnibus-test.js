/*jslint node: true, vars: true, indent: 4, nomen:true */
'use strict';

var Omnibus = require('../src/Omnibus'),
    vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore');

var upward = _(5).times(function () {
    return ['UP', 'OPEN', 'CLOSE'];
});
var downward = _(5).times(function () {
    return ['DOWN', 'OPEN', 'CLOSE'];
});

function appendCommands(batch) {
    var context = batch['peut etre instancié'];
    var cmd = _.flatten(upward.concat(downward));
    cmd = cmd.concat(cmd);
    cmd.forEach(function (e, i) {
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
            },
            ' l\'objet contient les méthodes requises': function (o) {
                assert.ok(o.nextCommand);
                assert.ok(o.userHasEntered);
                assert.ok(o.userHasExited);
                assert.ok(o.call);
                assert.ok(o.go);
            }
        }
    };
    return appendCommands(result);
}

vows.describe('Omnibus Elevator').addBatch(createBatch()).export(module);