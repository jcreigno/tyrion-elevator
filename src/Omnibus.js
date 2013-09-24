/*jslint node: true, vars: true, indent: 4, plusplus: true, nomen: true*/
'use strict';
var _ = require('underscore');


function Omnibus(size) {
    var upward = _(size).times(function () {
        return ['UP', 'OPEN', 'CLOSE'];
    });
    var downward = _(size).times(function () {
        return ['DOWN', 'OPEN', 'CLOSE'];
    });
    this.cycle = _.flatten(upward.concat(downward));
    this.current = 0;
}

Omnibus.prototype.nextCommand = function () {
    return this.cycle[(this.current++) % this.cycle.length];
};

Omnibus.prototype.call = function (atFloor, to) {
    console.log('call at floor %d to %s', atFloor, to);
};

Omnibus.prototype.go = function (floorToGo) {
    console.log('go to floor %d', floorToGo);
};

Omnibus.prototype.userHasEntered = function () {
    console.log('user has entered');
};

Omnibus.prototype.userHasExited = function () {
    console.log('user has exited');
};

Omnibus.prototype.reset = function (cause) {
    console.log('reset : %s', cause);
};

module.exports = function (size) {
    return new Omnibus(size);
};