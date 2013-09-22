/*jslint node: true, vars: true, indent: 4, plusplus: true */

'use strict';

function Omnibus(size) {
    var upward = Array.apply(null, new Array(size)).map(function () {
        return ['UP', 'OPEN', 'CLOSE'];
    });
    var downward = Array.apply(null, new Array(size)).map(function () {
        return ['DOWN', 'OPEN', 'CLOSE'];
    });
    this.cycle = [].concat.apply([], upward.concat(downward)); //flatten
    this.current = 0;
}

Omnibus.prototype.nextCommand = function () {
    return this.cycle[(this.current++) % this.cycle.length];
};

module.exports = function (size) {
    return new Omnibus(size);
};