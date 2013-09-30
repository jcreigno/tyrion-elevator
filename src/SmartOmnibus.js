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

State.prototype.reset = function (way) {
    State.bind(this)();
};

function SmartOmnibus(size) {
    this.size = size;
    this.queue = [];
    this.status = _(size).times(function () {
        return new State();
    });
    this.inUsers = 0;
    this.current = 0;
}

SmartOmnibus.prototype.statusAtfloor = function () {
    return this.status[this.current];
};

SmartOmnibus.prototype.requestedAtFloor = function (way) {
    var s = this.statusAtfloor();
    return s.OUT.UP || s.OUT.DOWN || s.IN;
};

SmartOmnibus.prototype.moveTo = function (floorNumber) {
    //console.log('move %d', floorNumber);
    if (floorNumber === this.current) {
        return [];
    }
    var nb = floorNumber - this.current;
    return _.times(Math.abs(nb), function () {
        return (nb < 0) ? 'DOWN' : 'UP';
    });
};

SmartOmnibus.prototype.updateQueue = function () {
    var self = this;
    if (self.queue.length === 0) {
        var maxWeight = -1;
        var floorIs;
        
        self.status.forEach(function (s, index) {
            var weight = s.OUT.UP + s.OUT.DOWN + s.IN;
            if (weight > maxWeight && self.current !== index) {
                maxWeight = weight;
                floorIs = index;
            }
        });
        this.queue = this.moveTo(floorIs);
    }
    
    return self.queue;
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
    //console.log('current floor is %d', this.current);
    var next = this.updateQueue().shift();
    if (!next) {
        //this.queue.unshift('CLOSE');
        next = 'NOTHING';
    } else if (next !== 'CLOSE') {
        if (this.requestedAtFloor(next)) {
            this.queue = ['CLOSE', next].concat(this.queue);
            this.statusAtfloor().reset(next);
            next = 'OPEN';
        }
    }
    
    return this.updateStatus(next);
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