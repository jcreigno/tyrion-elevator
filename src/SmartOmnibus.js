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

State.prototype.weight = function (way) {
    return this.OUT[way] + this.IN;
};

State.prototype.isRequested = function (way) {
    return this.weight(way) > 0;
};

function SmartOmnibus(size) {
    this.size = size;
    this.status = _(size).times(function () {
        return new State();
    });
    this.queue = [];
    this.inUsers = 0;
    this.current = 0;
    this.going = 'UP';
}

SmartOmnibus.prototype.statusAtfloor = function () {
    return this.status[this.current];
};

SmartOmnibus.prototype.requestedAtFloor = function (way) {
    return this.statusAtfloor().isRequested(way);
};

SmartOmnibus.prototype.updateQueue = function () {
    if (this.queue.length > 0) {
        return this.queue;
    }
    var i, requested = false;
    if (this.going === 'UP') {
        for (i = this.current; i < this.size - 1; i++) {
            requested |= this.status[i].isRequested('UP');
        }
    } else {
        for (i = this.current; i > 0; i--) {
            requested |= this.status[i].isRequested('DOWN');
        }
    }
    if (!requested) { //let's change way
        this.going = this.going === 'UP' ? 'DOWN' : 'UP';
        console.log('going %s', this.going);
    }
    this.queue.push(this.going);
    return this.queue;
};

SmartOmnibus.prototype.updateStatus = function (next) {
    console.log('next is %s', next);
    if (next === 'UP') {
        this.current++;
    } else if (next === 'DOWN') {
        this.current--;
    }
    return next;
};

SmartOmnibus.prototype.nextCommand = function () {
    var next = this.updateQueue().shift();
    if (next !== 'CLOSE') {
        if (this.requestedAtFloor(this.going)) {
            if (next) {
                this.queue.unshift(next);
            }
            this.queue.unshift('CLOSE');
            this.statusAtfloor().reset();
            next = 'OPEN';
        }
    }
    return this.updateStatus(next || 'NOTHING');
};

SmartOmnibus.prototype.call = function (atFloor, to) {
    console.log('call at floor %d to %s', atFloor, to);
    this.status[+atFloor].OUT[to]++;
    //console.log('status for this floor is %s', JSON.stringify(this.status[+atFloor]));
};

SmartOmnibus.prototype.go = function (floorToGo) {
    console.log('go to floor %d', floorToGo);
    this.status[+floorToGo].IN++;
    //console.log('status for this floor is %s', JSON.stringify(this.status[+floorToGo]));
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
    console.log('current state was %s', JSON.stringify(this));
    SmartOmnibus.bind(this)(this.size);
};

module.exports = function (size) {
    return new SmartOmnibus(size);
};