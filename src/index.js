/*jslint node: true, vars: true, indent: 4 */
'use strict';

var http = require('http'), url = require('url');

var elevator = require('./QueuedElevator')(5);


var commands = {
    'call' : function (query) {
        return elevator.call(query.atFloor, query.to);
    },
    'go' : function (query) {
        return elevator.go(query.floorToGo);
    },
    'nextCommand': elevator.nextCommand.bind(elevator),
    'userHasEntered': elevator.userHasEntered.bind(elevator),
    'userHasExited': elevator.userHasExited.bind(elevator),
    'reset': function (query) {
        return elevator.reset(query.cause);
    }
};

var server = http.createServer(function (req, res) {
    var u = url.parse(req.url, true);
    var cmd = u.pathname.substring(1);
    res.writeHead(200);
    if (commands[cmd]) {
        res.write(commands[cmd](u.query) || '');
    } else {
        res.write('NOTHING');
    }
    res.end();
}).listen(process.env.PORT || 8080, function () {
    console.log("Listening ...");
});

module.exports = server;