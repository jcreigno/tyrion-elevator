/*jslint node: true, vars: true, indent: 4, nomen:true, plusplus: true */
'use strict';

var QueuedElevator = require('../src/QueuedElevator'),
    vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore');

function createBatch() {
    var result = {
        'peut etre instancié': {
            topic: new QueuedElevator(5),
            ' l\'objet contient les méthodes requises': function (o) {
                assert.ok(o.nextCommand);
                assert.ok(o.userHasEntered);
                assert.ok(o.userHasExited);
                assert.ok(o.call);
                assert.ok(o.go);
            },
            'on appelle au 3ème étage': {
                topic: function (o) {
                    o.call(3);
                    return o;
                },
                'on reçoit la séquence [UP,UP,UP,OPEN,CLOSE]': function (o) {
                    var i = 0, res = [];
                    for (i = 0; i < 5; i++) {
                        res.push(o.nextCommand());
                    }
                    assert.equal(res.join(','), 'UP,UP,UP,OPEN,CLOSE');
                },
                'la commande suivante ': {
                    topic: function (o) {
                        return o.nextCommand();
                    },
                    'est NOTHING': function (cmd) {
                        assert.equal(cmd, 'NOTHING');
                    }
                }
            }
        }
    };
    return result;
}

function createBatch2() {
    var result = {
        'peut etre instancié': {
            topic: new QueuedElevator(5),
            'un usager veux aller au 2ème étage': {
                topic: function (o) {
                    o.go(2);
                    return o;
                },
                'on reçoit la séquence [UP,UP,OPEN,CLOSE]': function (o) {
                    var i = 0, res = [];
                    for (i = 0; i < 4; i++) {
                        res.push(o.nextCommand());
                    }
                    assert.equal(res.join(','), 'UP,UP,OPEN,CLOSE');
                },
                'la commande suivante ': {
                    topic: function (o) {
                        return o.nextCommand();
                    },
                    'est NOTHING': function (cmd) {
                        assert.equal(cmd, 'NOTHING');
                    }
                }
            }
        }
    };
    return result;
}

vows.describe('Queued Elevator')
    .addBatch(createBatch())
    .addBatch(createBatch2())
    .export(module);