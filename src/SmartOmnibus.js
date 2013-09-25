/*jslint node: true, vars: true, indent: 4, plusplus: true, nomen: true */
'use strict';
var _ = require('underscore');

function State() {
    this.IN = 0;
    this.OUT = {
        'UP' : 0,
        'DOWN' : 0
    };
}

State.prototype.reset = function () {
    State.bind(this)();
};

function SmartOmnibus(size) {
    this.size = size;
    var upward = _(size).times(function () {
        return 'UP';
    });
    var downward = _(size).times(function () {
        return 'DOWN';
    });
    this.cycle = upward.concat(downward);
    this.queue = [];
    this.status = _(size).times(function () {
        return new State();
    });
    this.current = 0;
}

SmartOmnibus.prototype.statusAtfloor = function () {
    return this.status[this.current % this.size];
};

SmartOmnibus.prototype.requestedAtFloor = function (way) {
    var s = this.statusAtfloor();
    return s.OUT[way] || s.IN;
};

SmartOmnibus.prototype.updateQueue = function () {
    if (this.queue.length === 0) {
        this.queue.push(this.cycle[this.current % this.cycle.length]);
    }
    return this.queue;
};

SmartOmnibus.prototype.nextCommand = function () {
    var next = this.updateQueue().shift();
    console.log('next is %s', next);
    if (this.requestedAtFloor(next)) {
        this.queue.unshift(next);
        this.queue.unshift('CLOSE');
        next = 'OPEN';
        this.statusAtfloor().reset();
    } else {
        console.log('no one asked for this floor %s', JSON.stringify(this.statusAtfloor()));
        this.current++;
    }
    return next;
};

SmartOmnibus.prototype.call = function (atFloor, to) {
    console.log('call at floor %d to %s', atFloor, to);
    this.status[+atFloor].OUT[to]++;
};

SmartOmnibus.prototype.go = function (floorToGo) {
    console.log('go to floor %d', floorToGo);
    this.status[+floorToGo].IN++;
};

SmartOmnibus.prototype.userHasEntered = function () {
    console.log('user has entered');
    this.inUsers++;
};

SmartOmnibus.prototype.userHasExited = function () {
    console.log('user has exited');
    this.inUsers--;
};

SmartOmnibus.prototype.reset = function (cause) {
    console.log('reset : %s', cause);
    SmartOmnibus.bind(this)(this.size);
};

module.exports = function (size) {
    return new SmartOmnibus(size);
};