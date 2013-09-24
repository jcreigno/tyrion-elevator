/*jslint node: true, vars: true, indent: 4, plusplus: true, nomen: true */
'use strict';
var _ = require('underscore');

function QueuedElevator(size) {
    this.size = size;
    this.orders = [];
    this.queue = [];
    this.currentFloor = 0;
    this.inUsers = 0;
}

function moveTo(nb) {
    console.log('move %d', nb);
    if (nb === 0) {
        return [];
    }
    return _.times(Math.abs(nb), function () {
        return (nb < 0) ? 'DOWN' : 'UP';
    });
}

QueuedElevator.prototype.updateQueue = function () {
    if (this.queue.length === 0) {
        if (this.orders.length === 0) {
            this.queue = ['NOTHING'];
        } else {
            var move = this.orders.shift() - this.currentFloor;
            this.queue = [].concat(moveTo(move), ['OPEN', 'CLOSE']);
        }
    }
    return this.queue;
};

QueuedElevator.prototype.nextCommand = function () {
    var next = this.updateQueue().shift();
    if (next === 'UP') {
        this.currentFloor++;
    } else if (next === 'DOWN') {
        this.currentFloor--;
    }
    return next || 'NOTHING';
};

QueuedElevator.prototype.call = function (atFloor, to) {
    console.log('call at floor %d to %s', atFloor, to);
    this.orders.push(+atFloor);
};

QueuedElevator.prototype.go = function (floorToGo) {
    console.log('go to floor %d', floorToGo);
    this.orders.push(+floorToGo);
};

QueuedElevator.prototype.userHasEntered = function () {
    console.log('user has entered');
    this.inUsers++;
};

QueuedElevator.prototype.userHasExited = function () {
    console.log('user has exited');
    this.inUsers--;
};

QueuedElevator.prototype.reset = function (cause) {
    console.log('reset : %s', cause);
    this.orders = [];
    this.queue = [];
    this.currentFloor = 0;
    this.inUsers = 0;
};

module.exports = function (size) {
    return new QueuedElevator(size);
};